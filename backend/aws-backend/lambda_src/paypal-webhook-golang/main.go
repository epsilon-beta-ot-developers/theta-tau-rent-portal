package main

import (
	"bytes"
	"log"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"

	"encoding/base64"
	"encoding/json"
)

func main() {
	lambda.Start(handler)
}

type WebhookSignature struct {
	AuthAlgo         string          `json:"auth_algo"`
	CertURL          string          `json:"cert_url"`
	TransmissionID   string          `json:"transmission_id"`
	TransmissionSig  string          `json:"transmission_sig"`
	TransmissionTime string          `json:"transmission_time"`
	WebhookID        string          `json:"webhook_id"`
	Event            json.RawMessage `json:"webhook_event"`
}

type TokenResponse struct {
	Scope       string `json:"scope"`
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	AppID       string `json:"app_id"`
	ExpiresIn   int    `json:"expires_in"`
	Nonce       string `json:"nonce"`
}

type VerifyWebhookResponse struct {
	VerificationStatus string `json:"verification_status"`
}

func GetPaypalBearerToken(client_id string, client_secret string) (*TokenResponse, error) {
	combined_secret := client_id + ":" + client_secret
	secretEncoded := base64.StdEncoding.EncodeToString([]byte(combined_secret))
	body := []byte("grant_type=client_credentials")

	tokenRequest, err := http.NewRequest("POST", "https://api-m.sandbox.paypal.com/v1/oauth2/token", bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	tokenRequest.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	tokenRequest.Header.Add("Authorization", "Basic "+secretEncoded)

	client := &http.Client{}
	result, err := client.Do(tokenRequest)
	if err != nil {
		return nil, err
	}
	defer result.Body.Close()

	newBearer := &TokenResponse{}
	err = json.NewDecoder(result.Body).Decode(newBearer)
	if err != nil {
		return nil, err
	}

	return newBearer, nil
}

func VerifyWebhookSignature(request *events.LambdaFunctionURLRequest, webhook_id string, token *TokenResponse) (*VerifyWebhookResponse, error) {
	headers := request.Headers

	verify_request := WebhookSignature{
		AuthAlgo:         headers["paypal-auth-algo"],
		CertURL:          headers["paypal-cert-url"],
		TransmissionID:   headers["paypal-transmission-id"],
		TransmissionSig:  headers["paypal-transmission-sig"],
		TransmissionTime: headers["paypal-transmission-time"],
		WebhookID:        webhook_id,
		Event:            json.RawMessage(request.Body),
	}
	jsonRequest, err := json.Marshal(verify_request)
	if err != nil {
		return nil, err
	}

	postUrl := "https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature"

	r, err := http.NewRequest("POST", postUrl, bytes.NewBuffer(jsonRequest))
	if err != nil {
		return nil, err
	}

	r.Header.Add("Content-Type", "application/json")
	r.Header.Add("Authorization", "Bearer "+token.AccessToken)

	client := &http.Client{}
	result2, err := client.Do(r)
	if err != nil {
		return nil, err
	}
	defer result2.Body.Close()

	verifyResponse := &VerifyWebhookResponse{}
	err = json.NewDecoder(result2.Body).Decode(&verifyResponse)
	if err != nil {
		return nil, err
	}

	return verifyResponse, nil
}

func handler(request events.LambdaFunctionURLRequest) (events.LambdaFunctionURLResponse, error) {
	client_id := "PAYPAL CLIENT ID HERE"
	client_secret := "PAYPAL CLIENT SECRET HERE"
	webhook_id := "PAYPAL WEBHOOK ID HERE"

	// we need to get data to verify the paypal invoice
	// https://developer.paypal.com/api/rest/webhooks/

	// need to verify that the message:
	// - came from paypal
	// - was not altered or corrupted during transmission
	// - was inteded for you
	// - contains a valid signature

	newBearer, err := GetPaypalBearerToken(client_id, client_secret)
	if err != nil {
		panic(err)
	}
	log.Println("Bearer: " + newBearer.AccessToken)

	verifyResponse, err := VerifyWebhookSignature(&request, webhook_id, newBearer)
	if err != nil {
		panic(err)
	}
	log.Println("Verification Response: " + verifyResponse.VerificationStatus)

	response2 := events.LambdaFunctionURLResponse{
		StatusCode: 200,
	}

	return response2, nil
}
