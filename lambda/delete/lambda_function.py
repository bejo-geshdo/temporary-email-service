import os

import boto3

from delete import delete_address, delete_mail
from check_address import check_active_address
from respons import respons, respons_error

table_name = os.environ["TABLE_NAME"]

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)

FAILED_DELETE_MSG = "Failed to delete"
SUCCESS_DELETE_MGS = "Successfull deletion"


def lambda_handler(event, context):
    type = event["queryStringParameters"]["type"]
    address = event["queryStringParameters"]["address"]

    if not check_active_address(address, table):
        return respons_error(
            status_code=404,
            msg=FAILED_DELETE_MSG,
            error="Address not found",
            body={"address": address},
        )

    if type == "address":
        # Add check if address exists
        if delete_address(address, table):
            return respons(
                status_code=200, msg=SUCCESS_DELETE_MGS, body={"address": address}
            )
        else:
            return respons_error(
                status_code=500,
                msg=FAILED_DELETE_MSG,
                error="Internal server error",
                body={"address": address},
            )

    elif type == "email":
        sk = event["queryStringParameters"]["sk"]
        if delete_mail(address, sk, table):
            return respons(
                status_code=200,
                msg=SUCCESS_DELETE_MGS,
                body={"address": address, "email": sk},
            )
        else:
            return respons_error(
                status_code=500,
                msg=FAILED_DELETE_MSG,
                error="Internal server error",
                body={"address": address, "email": sk},
            )
    else:
        return respons_error(status_code=400, msg=FAILED_DELETE_MSG, error="wrong type")
