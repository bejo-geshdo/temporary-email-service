import random
import string


def generate_random_string(length):
    return "".join(random.choice(string.ascii_lowercase) for _ in range(length))


def generate_new_address(domain: str):
    address = generate_random_string(8) + "@" + domain
    return address
