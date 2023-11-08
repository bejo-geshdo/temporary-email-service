import os
import json

import boto3

from s3 import check_file_exists
from respons import respons, respons_error

s3 = boto3.client("s3")

bucket_name = os.environ["BUCKET_NAME"]


def lambda_handler(event, context):
    message_id = event["queryStringParameters"]["messageId"]

    if check_file_exists(s3, bucket_name=bucket_name, key=message_id):
        try:
            url = s3.generate_presigned_url(
                "get_object",
                Params={"Bucket": bucket_name, "Key": message_id},
                ExpiresIn=300,
            )
            return respons(
                status_code=200, msg="Success generating URL", body={"url": url}
            )
            return {"statusCode": 200, "body": json.dumps(url)}
        except Exception as error:
            print(error)
            return respons_error(
                status_code=500, msg="Error generating URL", error=error
            )
            return {"statusCode": 500, "body": json.dumps("Error generating URL")}
    else:
        return respons_error(
            status_code=404, msg="Error generating URL", error="Email not found"
        )
        return {"statusCode": 404, "body": json.dumps("Email not found")}
