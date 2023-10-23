from datetime import datetime, timedelta


def get_date_plus_10_min():
    now = datetime.now()
    ten_minutes = now + timedelta(minutes=10)
    unixTimeStamp = int(datetime.timestamp(ten_minutes))
    return unixTimeStamp


def get_date_now():
    now = datetime.now()
    unixTimeStamp = int(datetime.timestamp(now))
    return unixTimeStamp
