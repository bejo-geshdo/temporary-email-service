import os
import json
import datetime

import boto3

from date import get_date
from get_address import get_address
from get_mail import get_emails_ddb

table_name = os.environ["TABLE_NAME"]

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    address = event["queryStringParameters"]["address"]

    # Get item from DB
    item = get_address(address, table)

    if item == False:
        return {"statusCode": 404, "body": json.dumps("Address not found")}

    # Check ttl is not older than 23:50:00

    if item["ttl"] > get_date(hours=23, minutes=50):
        return {"statusCode": 404, "body": json.dumps("To old to renew")}

    # Set ttl to time +10min for addrress
    new_ttl = get_date(minutes=10)

    try:
        respons = table.update_item(
            Key={"pk": address, "sk": "address#active"},
            UpdateExpression="set #t=:ttl",
            ExpressionAttributeValues={":ttl": new_ttl},
            ExpressionAttributeNames={"#t": "ttl"},
        )

    except Exception as Error:
        print(Error)
        return {"statusCode": 500, "body": json.dumps("Error updating time on address")}

    # Batch set ttl for all mail for address to +10min
    # TODO remove this and delete items when the address is deleted (trigged via ddb delete event)
    try:
        email_items = get_emails_ddb(address, table)

        for item in email_items:
            table.update_item(
                Key={{"pk": address, "sk": item["sk"]}},
                UpdateExpression="set ttl=:ttl",
                ExpressionAttributeValues={":ttl": new_ttl},
            )

    except Exception as error:
        print(error)
        return {
            "statusCode": 200,
            "body": json.dumps("Updated address TTL, failed to update email"),
        }

    # This does not extend ttl of items in S3
    # Items in S3 should not be able to live longer than 24h

    return {
        "statusCode": 200,
        "body": json.dumps(
            f"Successfully updated address and email TTL. New date: {datetime.datetime.utcfromtimestamp(new_ttl)}"
        ),
    }
