from boto3.dynamodb.conditions import Key, Attr


def get_emails_ddb(address: str, table):
    respons = table.query(
        KeyConditionExpression=Key("pk").eq(address) & Key("sk").begins_with("mail#")
    )
    return respons["Items"]
