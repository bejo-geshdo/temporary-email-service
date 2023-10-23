def check_active_address(address: str, table):
    get_active_item = {"pk": address, "sk": "address#active"}

    try:
        query = table.get_item(Key=get_active_item)

        if "Item" in query:
            return True
        else:
            return False
    except Exception as error:
        print("Eror with DDB")
        print(error)
        return False
