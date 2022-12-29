import json
import os
import boto3
from paypalrestsdk.notifications import WebhookEvent

def lambda_handler(event, context):
    try:
        headers = event["headers"]
        event_body = event["body"] # body is a string here
        
        transmission_id = headers["paypal-transmission-id"]
        timestamp = headers["paypal-transmission-time"]
        actual_signature = headers["paypal-transmission-sig"]
        cert_url = headers["paypal-cert-url"]
        auth_algo = headers["paypal-auth-algo"]
    except Exception as e:
        print("Exception: " + str(e))
        return {
            'statusCode': 400
        }

    try:
        webhook_id = os.environ["webhook_id"]
    except Exception as e:
        print("Could not obtain webhook_id: " + str(e))
        return {
            'statusCode': 500
        }

    response = WebhookEvent.verify(transmission_id, timestamp, webhook_id, event_body, cert_url, actual_signature, auth_algo)
    
    if (response == False):
        print("Could not verify webhook data")
        return {
        	'statusCode': 401
    	}
    
    body_json = json.loads(event_body)

    print("Webhook verified - id " + str(body_json['id']))

    sqs_url = os.environ['sqs_url']
    sqs = boto3.client('sqs')

    event_string = json.dumps(event)

    try:
        sqs.send_message(
            QueueUrl=sqs_url, MessageBody=event_string
        )
    except Exception as e:
        print("Could not send message to SQS - URL: " + str(sqs_url) + " - Error: " + str(e))
        return {
        	'statusCode': 500
    	}

    return {
        'statusCode': 200
    }

