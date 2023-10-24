# Take users email
# Look if active/exists
# Get all the mail metadata from ddb
import os
import json

import boto3

from utils.check_address import check_active_address
from utils.get_mail import get_emails_ddb

table_name = os.environ["TABLE_NAME"]

dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    email_address = event["queryStringParameters"]["email"]

    if check_active_address(email_address, table):
        try:
            items = get_emails_ddb(email_address, table)
            # print(items)
            return {"statusCode": 200, "body": json.dumps(items, default=str)}
        except Exception as error:
            print(error)
            return {"statusCode": 500, "body": json.dumps("Error with DB")}
    else:
        return {"statusCode": 404, "body": json.dumps("address not found")}
