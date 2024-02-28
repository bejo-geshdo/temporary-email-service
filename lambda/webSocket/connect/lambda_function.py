import os

import boto3

# from check_address import check_active_address, check_inactive_address

table_name = os.environ["TABLE_NAME"]

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    # Get websocket connection id
    connection_id = event["requestContext"]["connectionId"]
    # Get address from address query
    address = event["queryStringParameters"]["address"]

    # Check if address is active
    # if not check_active_address(address, table):
    #     # If not return 500
    #     return {"statusCode": 500}

    # Create item in DDB with pk address and sk connection id
    addressItem = {"pk": address, "sk": "connectionId#" + connection_id}
    table.put_item(Item=addressItem)

    sessionItem = {"pk": connection_id, "sk": address}
    table.put_item(Item=sessionItem)

    # Return 200
    return {"statusCode": 200}
