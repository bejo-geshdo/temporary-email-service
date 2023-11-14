import os

import boto3

from date import get_date
from util import generate_new_address
from check_address import check_active_address, check_inactive_address
from respons import respons, respons_error

table_name = os.environ["TABLE_NAME"]
domain = os.environ["DOMAIN"]

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    # if not event["body"]["secret"]:
    #     return respons_error(
    #         status_code=400,
    #         msg="failed to create address",
    #         error="Missing client secret",
    #     )
    # secret = event["body"]["secret"]
    # TODO Implement store secret hash in DB. Verify secret in every call user makes
    # TODO Send in a public key used to encypt incomming emails and store them in S3
    new_address = generate_new_address(domain)

    # TODO add retry logic if address exists
    if check_active_address(new_address, table) or check_inactive_address(
        new_address, table
    ):
        return respons_error(
            status_code=400,
            msg="failed to create address",
            error="Address alredy exists",
            body={"address": new_address},
        )

    new_address_item = {
        "pk": new_address,
        "sk": "address#active",
        "created_at": get_date(),
        "ttl": get_date(minutes=10),
        "domain": new_address.split("@")[1],
        "email": new_address,
    }

    table.put_item(Item=new_address_item)

    return respons(
        status_code=200,
        msg="Successfully created a new address",
        body={"address": new_address, "ttl": new_address_item["ttl"]},
    )
