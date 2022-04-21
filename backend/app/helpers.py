import nltk
from app.bad_words import bad_words

nltk.download('punkt')


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


def is_clean(sentence):
    words = nltk.word_tokenize(sentence)
    words = [word.lower() for word in words]
    for word in words:
        if word in bad_words:
            return False

    return True
