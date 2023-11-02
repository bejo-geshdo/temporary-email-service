def check_file_exists(s3_client, bucket_name: str, key: str):
    try:
        s3_client.get_object(Bucket=bucket_name, Key=key)
        return True
    except s3_client.exceptions.NoSuchKey:
        return False
