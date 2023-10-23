import os

import boto3

from utils.check_address import check_active_address

table_name = os.environ["TABLE_NAME"]

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    # Look if we need to add for loop for "Records"
    recipients = event["Records"][0]["ses"]["receipt"]["recipients"]
    print(recipients)

    found = False

    for recipient in recipients:
        if check_active_address(recipient, table):
            found = True
            break

    if found:
        # If the email is found go to the next rule (save to s3)
        return {"disposition": "STOP_RULE"}
    else:
        # If not found continue the current rule (bounce email)
        return {"disposition": "CONTINUE"}
