# 1. Get mail from S3.
# 2. Parse out message (Get first 50 char as teaser)
# For each recipient do the following:
# 1. Check address again
# 2. Add a item to ddb. (TO:, From:, subject,Teaser:, messageId, path in S3?, spamVerdict, virusVerdict:, )

import os
import re
import json
from uuid import uuid4

import boto3
from boto3.dynamodb.conditions import Key

from check_address import check_active_address
from date import get_date_plus_10_min, get_date_now
from ses_email import parse_email

table_name = os.environ["TABLE_NAME"]
bucket_name = os.environ["BUCKET_NAME"]
ws_url = os.environ["API_URL"]

dynamodb = boto3.resource("dynamodb")
s3 = boto3.client("s3")
apiGW = boto3.client("apigatewaymanagementapi", endpoint_url=ws_url)

table = dynamodb.Table(table_name)

print(ws_url)


def lambda_handler(event, context):
    message_id = event["Records"][0]["ses"]["mail"]["messageId"]
    common_headers = event["Records"][0]["ses"]["mail"]["commonHeaders"]

    receipt = event["Records"][0]["ses"]["receipt"]
    recipients = receipt["recipients"]

    # Download and pars eml file here

    eml = s3.get_object(Bucket=bucket_name, Key=message_id)
    msg = parse_email(eml["Body"].read())

    teaser = "Not implemented"

    for recipient in recipients:
        if check_active_address(recipient, table):
            mail_item = {
                "pk": recipient,
                "sk": "mail#" + str(uuid4()),
                "to": recipients,
                "from": common_headers["from"][0],
                "from_address": re.search(
                    r"<(.*?)>", str(common_headers["from"][0])
                ).group(1),
                "subject": common_headers["subject"],
                "teaser": teaser,
                "spamVerdict": receipt["spamVerdict"]["status"],
                "virusVerdict": receipt["virusVerdict"]["status"],
                "messageId": message_id,
                "created_at": get_date_now(),
                "ttl": get_date_plus_10_min(),  # TODO Change this to 24h
                "domain": recipient.split("@")[1],
                "email": recipient,
            }

            try:
                table.put_item(Item=mail_item)
            except Exception as error:
                # Add some kind of retry logic
                print("Failed to add mail item for " + recipient)
                print(error)

            # Logic to handel the websockets
            try:
                query = table.query(
                    KeyConditionExpression=Key("pk").eq(recipient)
                    & Key("sk").begins_with("connectionId#")
                )

                for item in query["Items"]:
                    connection_id = item["sk"].split("#")[1]
                    # TODO Send id of mail item or mail item itself?
                    apiGW.post_to_connection(
                        Data=json.dumps(mail_item),
                        ConnectionId=connection_id,
                    )

            except Exception as error:
                print("Failed to send messages to websockers to" + recipient)
                print(error)

    return {"disposition": "CONTINUE"}
