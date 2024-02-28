import os

import boto3
from boto3.dynamodb.conditions import Key


table_name = os.environ["TABLE_NAME"]

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    # Get websocket connection id
    connection_id = event["requestContext"]["connectionId"]

    # Query DDB for connection id to get address
    respons = table.query(
        KeyConditionExpression=Key("pk").eq(
            connection_id
        )  # & Key("sk").begins_with("address#")
    )

    # Get address from respons
    address = respons["Items"][0]["sk"]

    table.delete_item(Key={"pk": address, "sk": "connectionId#" + connection_id})
    table.delete_item(Key={"pk": connection_id, "sk": address})

    # Return 200
    return {"statusCode": 200}
