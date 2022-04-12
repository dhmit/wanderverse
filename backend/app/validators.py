from app.helpers import is_clean


def verse_is_valid(verse_obj):
    message = {}
    if len(verse_obj["page"]) and not page_is_valid(verse_obj["page"]):
        message["key"] = "page"
        message["message"] = "Page number is invalid. Please submit without it."
        return message

    keys_to_check = ["verse", "book_title", "author", "genre"]
    for key in keys_to_check:
        if not is_clean(verse_obj[key]):
            message["key"] = key
            message["message"] = "Some words are not allowed. Please resubmit."
            return message

    # arbitrary length values. rethink?
    words = verse_obj['verse'].split(' ')
    if len(words) < 1:
        message["key"] = "verse"
        message["message"] = "Length"
        return message
    return True


def page_is_valid(page):
    return page.isnumeric() and 0 < int(page) < 10000
