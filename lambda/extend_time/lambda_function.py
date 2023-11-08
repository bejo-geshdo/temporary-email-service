import os

import boto3

from date import get_date
from get_address import get_address
from get_mail import get_emails_ddb
from respons import respons, respons_error

table_name = os.environ["TABLE_NAME"]

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)

FAILED_EXTEND_MSG = "Failed to extend time"


def lambda_handler(event, context):
    address = event["queryStringParameters"]["address"]

    # Get item from DB
    item = get_address(address, table)

    if item == False:
        return respons_error(
            status_code=404,
            msg=FAILED_EXTEND_MSG,
            error="Address not found",
            body={"address": address},
        )

    # Check ttl is not older than 23:50:00
    if item["ttl"] > get_date(hours=23, minutes=50):
        return respons_error(
            status_code=400,
            msg=FAILED_EXTEND_MSG,
            error="To old to renew",
            body={"address": address, "ttl": item["ttl"]},
        )

    # Set ttl to time +10min for addrress
    new_ttl = get_date(minutes=10)

    try:
        res = table.update_item(
            Key={"pk": address, "sk": "address#active"},
            UpdateExpression="set #t=:ttl",
            ExpressionAttributeValues={":ttl": new_ttl},
            ExpressionAttributeNames={"#t": "ttl"},
        )

    except Exception as Error:
        print(Error)
        return respons_error(
            status_code=500,
            msg=FAILED_EXTEND_MSG,
            error=Error,  # TODO don't return full error
            body={"address": address},
        )

    # Batch set ttl for all mail for address to +10min
    # This does not extend ttl of items in S3
    # Items in S3 should not be able to live longer than 24h
    try:
        email_items = get_emails_ddb(address, table)

        for item in email_items:
            table.update_item(
                Key={{"pk": address, "sk": item["sk"]}},
                UpdateExpression="set ttl=:ttl",
                ExpressionAttributeValues={":ttl": new_ttl},
            )

    except Exception as error:
        # TODO handel this better
        print(error)
        return respons_error(
            status_code=200,
            msg="Successfully extend time for address. Failed to extend emails!",
            error=Error,  # TODO don't return full error
            body={"address": address, "ttl": new_ttl},
        )

    return respons(
        status_code=200,
        msg="Successfully extend time for address and emails!",
        body={"address": address, "ttl": new_ttl},
    )
