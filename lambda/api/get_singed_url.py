import os
import json

import boto3

s3 = boto3.client("s3")

bucket_name = os.environ["BUCKET_NAME"]


def lambda_handler(event, context):
    message_id = event["queryStringParameters"]["messageId"]

    try:
        url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": "test/" + message_id},
            ExpiresIn=300,
        )
        return {"statusCode": 200, "body": json.dumps(url)}
    except Exception as error:
        print(error)
        return {"statusCode": 500, "body": json.dumps("Error generating URL")}
