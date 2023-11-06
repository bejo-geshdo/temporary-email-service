import os
import json

import boto3

from delete import delete_address, delete_mail
from check_address import check_active_address

table_name = os.environ["TABLE_NAME"]

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    type = event["queryStringParameters"]["type"]
    address = event["queryStringParameters"]["address"]

    if not check_active_address(address, table):
        return {"statusCode": 404, "body": json.dumps("address not found")}

    if type == "address":
        # Add check if address exists
        if delete_address(address, table):
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
        if delete_mail(address, sk, table):
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
