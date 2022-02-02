import random
import nltk


def get_random_id(qs):
    max_count = qs.count()
    return random.randint(1, max_count)


def get_suffix(n):
    j = n % 10
    k = n % 100
    if j == 1 and k != 11:
        return str(n) + "st"

    if j == 2 and k != 12:
        return str(n) + "nd"

    if j == 3 and k != 13:
        return str(n) + "rd"

    return str(n) + "th"
