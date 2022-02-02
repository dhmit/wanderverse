from app.helpers import is_clean


def verse_is_valid(verse_obj):
    if not is_clean(verse_obj['verse']) or not is_clean(verse_obj['author']) \
      or not is_clean(verse_obj['author']) or not is_clean(verse_obj['genre']):
        return False
    # arbitrary length values. rethink?
    words = verse_obj['verse'].split(' ')
    if len(words) < 3 or len(verse_obj['verse']) < 5:
        return False
    return True
