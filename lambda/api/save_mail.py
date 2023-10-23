# 1. Get mail from S3.
# 2. Parse out message (Get first 50 char as teaser)
# For each recipient do the following:
# 1. Check address again
# 2. Add a item to ddb. (TO:, From:, subject,Teaser:, messageId, path in S3?, spamVerdict, virusVerdict:, )

import os
import re
from uuid import uuid4

import boto3

from utils.check_address import check_active_address
from utils.date import get_date_plus_10_min, get_date_now

table_name = os.environ["TABLE_NAME"]

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    message_id = event["Records"][0]["ses"]["mail"]["messageId"]
    common_headers = event["Records"][0]["ses"]["mail"]["commonHeaders"]

    receipt = event["Records"][0]["ses"]["receipt"]
    recipients = receipt["recipients"]

    # Download and pars eml file here
    teaser = "teaser"

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
                "ttl": get_date_plus_10_min(),
                "domain": recipient.split("@")[1],
                "email": recipient,
            }

            try:
                table.put_item(Item=mail_item)
            except Exception as error:
                # Add some kind of retry logic
                print("Failed to add mail item for " + recipient)
                print(error)

    return {"disposition": "CONTINUE"}
