package main

import (
	"context"
	"encoding/json"
	"io"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go/aws"
	validator "github.com/eryk-vieira/go-cognito-jwt-validator"
	"github.com/golang-jwt/jwt"
)

// create struct to hold cognito login url params
type CognitoLoginURLParams struct {
	RedirectURI         string     `json:"redirect_uri"`
	RedirectParams      url.Values `json:"redirect_params"`
	ResponseType        string     `json:"response_type"`
	ClientID            string     `json:"client_id"`
	State               string     `json:"state"`
	Scope               string     `json:"scope"`
	CodeChallengeMethod string     `json:"code_challenge_method"`
	CodeChallenge       string     `json:"code_challenge"`
}

func StringifyURLParams(params CognitoLoginURLParams) string {
	// create string for redirect uri for cognito
	var output = url.Values{}

	redirect := params.RedirectURI

	// check if redirect params has values
	if len(params.RedirectParams) > 0 {
		redirect += "?" + params.RedirectParams.Encode()
	}
	output.Add("response_type", params.ResponseType)
	output.Add("client_id", params.ClientID)
	output.Add("redirect_uri", redirect)
	// output.Add("code_challenge_method", params.CodeChallengeMethod)
	// output.Add("code_challenge", params.CodeChallenge)

	return output.Encode() + "&scope=email+openid+phone"
}

var error500 = events.APIGatewayProxyResponse{
	StatusCode: 500,
	Body:       "Internal Server Error",
}

func errorResponse(code int, body string, err error) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode: code,
		Body:       body,
	}, error(err)
}

func RefreshToken(ctx context.Context, tokenClaims map[string]string, cookie_map map[string]string, svc_cognito *cognitoidentityprovider.Client, clientID string) (map[string]string, error) {
	var returnMap = map[string]string{}
	var refreshExpiration int64
	var refreshExpirationDate string
	// check if token is 24 hours within expiration
	var dayDuration, _ = time.ParseDuration("24h")
	var expTime, err = strconv.ParseInt(tokenClaims["exp"], 10, 64)
	if err != nil {
		return returnMap, err
	}
	if time.Unix(expTime, 0).Before(time.Now().Add(dayDuration)) {
		// refresh token
		AuthRefreshInput := &cognitoidentityprovider.InitiateAuthInput{
			AuthFlow: "REFRESH_TOKEN_AUTH",
			AuthParameters: map[string]string{
				"REFRESH_TOKEN": cookie_map["refresh_token"],
			},
			ClientId: aws.String(clientID),
		}
		refreshResult, err := svc_cognito.InitiateAuth(ctx, AuthRefreshInput)
		if err != nil {
			return returnMap, err
		}
		returnMap["access_token"] = *refreshResult.AuthenticationResult.AccessToken
		returnMap["id_token"] = *refreshResult.AuthenticationResult.IdToken
		returnMap["refresh_token"] = *refreshResult.AuthenticationResult.RefreshToken
	} else {
		returnMap["access_token"] = cookie_map["access_token"]
		returnMap["id_token"] = cookie_map["id_token"]
		returnMap["refresh_token"] = cookie_map["refresh_token"]
	}
	refreshExpiration, err = strconv.ParseInt(tokenClaims["exp"], 10, 64)
	if err != nil {
		return returnMap, err
	}
	refreshExpirationDate = time.Unix(refreshExpiration, 0).Format(time.RFC1123)
	returnMap["exp"] = refreshExpirationDate

	return returnMap, nil
}

// Handler is our lambda handler invoked by the `lambda.Start` function call
func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	// get cognito login url from env
	cognitoHostedDomain := os.Getenv("COGNITO_HOSTED_UI_DOMAIN")
	if cognitoHostedDomain == "" {
		// return 500 error response
		return errorResponse(500, "", nil)
	}

	cognitoRedirect := os.Getenv("COGNITO_REDIRECT_URI")
	if cognitoRedirect == "" {
		// return 500 error response
		return errorResponse(500, "", nil)
	}

	cognitoClientID := os.Getenv("COGNITO_CLIENT_ID")
	if cognitoClientID == "" {
		// return 500 error response
		return errorResponse(500, "", nil)
	}

	cognitoPoolID := os.Getenv("COGNITO_POOL_ID")
	if cognitoPoolID == "" {
		// return 500 error response
		return errorResponse(500, "", nil)
	}

	loginUrl := cognitoHostedDomain + "&redirect_uri=" + cognitoRedirect

	var Response302 = events.APIGatewayProxyResponse{
		StatusCode: 302,
		Headers: map[string]string{
			"Location": loginUrl,
		},
	}

	// grab path from reuqest
	var path = request.Path
	if path == "/" {
		path = "/index.html"
	}

	// grab cookie from header
	cookie, ok := request.Headers["Cookie"] // in form of "token={access_token};user_id_token={id_token}"
	// if cookie exists, parse it
	if !ok {
		// return 302 response to login page
		return events.APIGatewayProxyResponse{
			StatusCode: 302,
			Headers: map[string]string{
				"Location": loginUrl,
			},
		}, nil
	}

	// split cookie into tokens
	cookie_tokens := strings.Split(cookie, ";")
	// create map
	cookie_map := map[string]string{}
	for i := range cookie_tokens {
		split := strings.Split(cookie_tokens[i], "=")
		key := split[0]
		cookie_map[key] = split[1]
	}

	// if cookie exists
	if ok {
		// check if cookie is valid
		validator := validator.New(&validator.Config{
			Region:          "us-east-1",
			CognitoPoolId:   cognitoPoolID,
			CognitoClientId: cognitoClientID,
		})
		err := validator.Validate(cookie_map["id_token"])
		if err != nil {
			// return 302 response to login page
			return Response302, nil
		}

		// create cognito session for refreshing token
		cognito_options := cognitoidentityprovider.Options{}
		svc_cognito := cognitoidentityprovider.New(cognito_options)

		// Parse the token without validating it (you'll need to validate it separately)
		parsedToken, _, err := new(jwt.Parser).ParseUnverified(cookie_map["access_token"], jwt.MapClaims{})
		if err != nil {
			return error500, nil
		}
		// Convert the parsed token to a MapClaims
		mapclaims, ok := parsedToken.Claims.(jwt.MapClaims)
		if !ok {
			return error500, nil
		}
		claimsJSON, err := json.Marshal(mapclaims)
		if err != nil {
			return error500, nil
		}
		var jsonclaimsmap map[string]interface{}
		err = json.Unmarshal(claimsJSON, &jsonclaimsmap)
		if err != nil {
			return error500, nil
		}
		claimsStrMap := make(map[string]string)
		NewTokens, err := RefreshToken(ctx, claimsStrMap, cookie_map, svc_cognito, cognitoClientID)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: 302,
				Headers: map[string]string{
					"Location": loginUrl,
				},
			}, nil
		}

		// setup aws session for s3 bucket
		var s3_sess = s3.Options{}
		svc_s3 := s3.New(s3_sess)

		// get the S3 object for the path file
		bucket_name := "ebthetatauhousing.org"
		obj, err := svc_s3.GetObject(ctx, &s3.GetObjectInput{
			Bucket: &bucket_name,
			Key:    &path,
		})
		if err != nil {
			// return 404 error response
			errorResponse(404, err.Error(), nil)
		}
		defer obj.Body.Close()

		// read the file
		data, err := io.ReadAll(obj.Body)
		if err != nil {
			// return 500 error response
			errorResponse(500, err.Error(), nil)
		}

		// return 200 response with index.html
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			MultiValueHeaders: map[string][]string{
				"Content-Type": {"text/html"},
				// set cookie to token
				"Set-Cookie": {
					"access_token=" + NewTokens["access_token"] + "; Secure; SameSite=None; Expires=" + NewTokens["exp"],
					"id_token=" + NewTokens["id_token"] + "; Secure; SameSite=None; Expires=" + NewTokens["exp"],
					"refresh_token=" + NewTokens["refresh_token"] + "; Secure; SameSite=None; Expires=" + NewTokens["exp"],
				},
			},
			Body: string(data),
		}, nil
	}

	// if cookies doesnt exist, return 500
	errorResponse(500, "Internal Server Error", nil)

	return Response302, nil
}

func main() {
	lambda.Start(Handler)
}
