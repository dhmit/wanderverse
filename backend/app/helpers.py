import random
import nltk


def get_random_id(qs):
    max_count = qs.count()
    return random.randint(1, max_count)


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
