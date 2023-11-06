from utils.date import get_date_now
from utils.get_mail import get_emails_ddb


def delete_address(address: str, table):
    try:
        respons = table.delete_item(
            Key={"pk": address, "sk": "address#active"}, ReturnValues="ALL_OLD"
        )
        if respons["Attributes"]:
            return True
        else:
            print("Item does not exist")
            return False
    except Exception as error:
        print(error)
        return False


def delete_address_ddb(
    address: str,
    table,
):
    try:
        items = get_emails_ddb(address, table)

        table.put_item(
            Item={"pk": address, "sk": "address#inactive", "deleted_at": get_date_now()}
        )

        if len(items) > 0:
            with table.batch_writer() as batch:
                for item in items:
                    batch.delete_item(Key={"pk": item["pk"], "sk": item["sk"]})

        return True
    except Exception as error:
        print(error)
        return False


def delete_mail(address: str, sk: str, table):
    key = {"pk": address, "sk": sk}

    try:
        # TODO Make sure mail obj not delete if used by multiple
        # s3.delete_object(Bucket=bucket_name, Key=message_id)

        table.delete_item(Key=key)
        print("deleted email")
        return True
    except Exception as error:
        print(error)
        return False


def delete_mail_ddb(item, s3, bucket_name: str):
    try:
        message_id = item["messageId"]["S"]
        # TODO Make sure mail obj not delete if used by multiple
        s3.delete_object(Bucket=bucket_name, Key=message_id)

        return True
    except Exception as error:
        print(error)
        return False
