package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/golang-jwt/jwt"
)

var error500 = events.APIGatewayProxyResponse{
	StatusCode: 500,
	Body:       "Internal Server Error2",
}

type CognitoResponse struct {
	ID_token      string `json:"id_token"`
	Access_token  string `json:"access_token"`
	Refresh_token string `json:"refresh_token"`
	Expires_in    int    `json:"expires_in"`
	Token_type    string `json:"token_type"`
}

// Handler is our lambda handler invoked by the `lambda.Start` function call
func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	// format will be URL/parse-auth?code=<code>
	// get code and exchange for tokens through cognito
	code := request.QueryStringParameters["code"]

	// get cognito login url from env
	cognitoHostedDomain := os.Getenv("COGNITO_HOSTED_UI_DOMAIN")
	if cognitoHostedDomain == "" {
		// return 500 error response
		return error500, nil
	}

	cognitoRedirectURI := os.Getenv("COGNITO_REDIRECT_URI")
	if cognitoRedirectURI == "" {
		// return 500 error response
		return error500, nil
	}

	finalRedirectURI := os.Getenv("FINAL_REDIRECT_URI")
	if finalRedirectURI == "" {
		// return 500 error response
		return error500, nil
	}

	clientID := os.Getenv("CLIENT_ID")
	if clientID == "" {
		// return 500 error response
		return error500, nil
	}

	clientSecret := os.Getenv("CLIENT_SECRET")
	if clientSecret == "" {
		// return 500 error response
		return error500, nil
	}

	data := url.Values{}
	data.Set("grant_type", "authorization_code")
	data.Set("client_id", clientID)
	data.Set("client_secret", clientSecret)
	data.Set("code", code)
	data.Set("redirect_uri", cognitoRedirectURI)

	// set header to application/x-www-form-urlencoded
	req, err := http.NewRequest("POST", cognitoHostedDomain, strings.NewReader(data.Encode()))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "Could not create http request",
		}, nil
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "Could not make http call",
		}, nil
	}
	defer resp.Body.Close()

	// return response from cognito
	var cognitoResponse CognitoResponse
	err = json.NewDecoder(resp.Body).Decode(&cognitoResponse)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "could not decode response from cognito",
		}, nil
	}

	// create cognito session for refreshing token
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String("us-east-1"),
	}))
	svc := cognitoidentityprovider.New(sess)

	// Parse the token without validating it (you'll need to validate it separately)
	parsedToken, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		return error500, nil
	}
	// Convert the parsed token to a MapClaims
	if claims, ok := parsedToken.Claims.(jwt.MapClaims)
	if !ok {
		return error500, nil
	}

	// check if token is 24 hours within expiration
	if claims["exp"] - time.Now().Unix() < (time.Now() + 24 * time.Hour).Unix() {
		// refresh token
		AuthRefreshInput = &cognitoidentityprovider.InitiateAuthInput{
			AuthFlow: aws.String("REFRESH_TOKEN_AUTH"),
			AuthParameters: map[string]string{
				"REFRESH_TOKEN": cognitoResponse.Refresh_token,
			},
			ClientId: aws.String(clientID),
		}
		refreshResult, err := svc.InitiateAuth(AuthRefreshInput)
		if err != nil {
			// return to login page
			return Response302, nil
		}
	}


	input := &cognitoidentityprovider.GetUserInput{
		AccessToken: aws.String(cognitoResponse.Access_token), // Replace with the user's access token
	}
	result, err := svc.GetUser(input)
	// check for err later

	// return to frontend
	return events.APIGatewayProxyResponse{
		StatusCode: 302,
		MultiValueHeaders: map[string][]string{
			"Location": {finalRedirectURI},
			// set cookie to token
			"Set-Cookie": {
				"access_token=" + cognitoResponse.Access_token + "; HttpOnly; Secure; SameSite=None",
				"user_id_token=" + cognitoResponse.ID_token + "; Secure; SameSite=None",
				"refresh_token=" + cognitoResponse.Refresh_token + "; HttpOnly; Secure; SameSite=None",
			},
		},
	}, nil

}

func main() {
	lambda.Start(Handler)
}
