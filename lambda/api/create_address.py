import os
import json

import boto3

from utils.date import get_date_plus_10_min, get_date_now
from utils.util import generate_new_address
from utils.check_address import check_active_address

table_name = os.environ["TABLE_NAME"]
domain = "mail.castrojonsson.se"

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    new_address = generate_new_address()

    if check_active_address(new_address, table):
        return {
        'statusCode': 400,
        'body': json.dumps('address exists')
    }

    new_address_item = {
        'pk': new_address,
        'sk': "address#active",
        'created_at': get_date_now(),
        'ttl': get_date_plus_10_min(),
        'domain': new_address.split("@")[1],
        'email': new_address
    }

    put_item = table.put_item(Item=new_address_item)

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }


