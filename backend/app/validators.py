from app.helpers import is_clean


def verse_is_valid(verse_obj):
    for key in verse_obj:
        if not is_clean(verse_obj[key]):
            return False

    # arbitrary length values. rethink?
    words = verse_obj['verse'].split(' ')
    if len(words) < 1:
        return False
    return True
