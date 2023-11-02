from utils.date import get_date_now
from utils.get_mail import get_emails_ddb


def delete_address(address: str, table, s3, bucket_name: str):
    try:
        items = get_emails_ddb(address, table)

        table.delete_item(Key={"pk": address, "sk": "address#active"})
        table.put_item(
            Item={"pk": address, "sk": "address#inactive", "deleted_at": get_date_now()}
        )

        with table.batch_writer() as batch:
            for item in items:
                batch.delete_item(Key={"pk": item["pk"], "sk": item["sk"]})

        s3_object = [{"key": dictionary["messageId"]} for dictionary in items]

        s3.delete_objects(
            Bucket=bucket_name,
            Delete={"Objects": s3_object},
        )

        print("Successfully deleted")
        return True
    except Exception as error:
        print(error)
        return False


def delete_mail(address: str, sk: str, table, s3, bucket_name: str):
    key = {"pk": address, "sk": sk}

    try:
        response = table.get_item(Key=key)
        item = response["Item"]
        message_id = item["messageId"]

        # Takes an S3 clients and deletes the item
        # TODO Make sure mail obj not delete if used by multiple
        # TODO Just delete the item and trigger an other function to delete S3 obj
        s3.delete_object(Bucket=bucket_name, Key=message_id)

        table.delete_item(Key=key)
        print("deleted email")
        return True
    except Exception as error:
        print(error)
        return False
