# Take users email
# Look if active/exists
# Get all the mail metadata from ddb
import os
import json

import boto3

from check_address import check_active_address
from get_mail import get_emails_ddb
from respons import respons, respons_error

table_name = os.environ["TABLE_NAME"]

dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    email_address = event["queryStringParameters"]["email"]

    if check_active_address(email_address, table):
        try:
            items = get_emails_ddb(email_address, table)
            return respons(status_code=200, msg="Returning users emils", body=items)
            return {"statusCode": 200, "body": json.dumps(items, default=str)}
        except Exception as error:
            print(error)
            return respons_error(
                status_code=500, msg="Failed to return emails", error=error
            )
            return {"statusCode": 500, "body": json.dumps("Error with DB")}
    else:
        return respons_error(
            status_code=404, msg="Failed to return emails", error="Address not found"
        )
        return {"statusCode": 404, "body": json.dumps("address not found")}
