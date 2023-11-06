from email import message_from_bytes


# TODO Make this work
def parse_email(mail_object):
    msg = message_from_bytes(mail_object)

    if msg.is_multipart():
        for part in msg.get_payload():
            if part.get_content_type() == "text/plain":
                print("Found text in multipart")
                print(part.get_payload(decode=True).decode())
                return part.get_payload(decode=True)
    else:
        if msg.get_content_type() == "text/plain":
            print(msg.get_payload(decode=True))
            return msg.get_payload(decode=True)
