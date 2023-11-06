import os

import boto3

from delete import delete_address_ddb, delete_mail_ddb

table_name = os.environ["TABLE_NAME"]
bucket_name = os.environ["BUCKET_NAME"]

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    # TODO Add for each loop
    item = event["Records"][0]["dynamodb"]["OldImage"]
    sk = item["sk"]["S"]
    pk = item["pk"]["S"]

    if sk == "address#active":
        print("del address function")
        if delete_address_ddb(pk, table):
            print(f"success delted address {pk}")
        else:
            print(f"failed to delete address {pk}")
        # TODO add if true/false
        return
    elif sk.startswith("mail#"):
        print("del email function")
        if delete_mail_ddb(item, s3, bucket_name):
            print("success deleted email")
        else:
            print("Failed to delete email")
        # TODO add if true/false
        return
    else:
        print("Do nothing and return")
        print(event)
        return
