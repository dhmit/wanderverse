import random


def get_random_obj(qs):
    max_count = qs.count()
    random_int = random.randint(0, max_count - 1)
    return qs[random_int]


def get_suffix(n):
    j = n % 10
    k = n % 100
    if j is 1 and k is not 11:
        return str(n) + "st"

    if j is 2 and k is not 12:
        return str(n) + "nd"

    if j is 3 and k is not 13:
        return str(n) + "rd"

    return str(n) + "th"
