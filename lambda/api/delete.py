import os
import json

import boto3

from utils.delete import delete_address, delete_mail

table_name = os.environ["TABLE_NAME"]
bucket_name = os.environ["BUCKET_NAME"]

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    type = event["queryStringParameters"]["type"]
    address = event["queryStringParameters"]["address"]

    if type == "address":
        if delete_address(address, table, s3, bucket_name):
            return {
                "statusCode": 200,
                "body": json.dumps(f"successfuly deleted address: {address}"),
            }
        else:
            return {
                "statusCode": 500,
                "body": json.dumps(f"ERROR deleting address: {address}"),
            }
    elif type == "email":
        sk = event["queryStringParameters"]["sk"]
        if delete_mail(address, sk, table, s3, bucket_name):
            return {
                "statusCode": 200,
                "body": json.dumps(
                    f"successfuly deleted mail: {sk}, address: {address}"
                ),
            }
        else:
            return {
                "statusCode": 500,
                "body": json.dumps(f"ERROR deleted mail: {sk}, address: {address}"),
            }
    else:
        return {"statusCode": 400, "body": json.dumps("Wrong type")}

    return
