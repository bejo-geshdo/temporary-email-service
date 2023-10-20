import os

import boto3

from utils.check_address import check_active_address

table_name = os.environ["TABLE_NAME"]

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
   address = event["address"]

   return check_active_address(address, table)