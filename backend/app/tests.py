# pylint: disable-msg = C0116
# pylint: disable-msg = E0401
# ignoring pylint's `missing-function-docstring` errors
import json
import random
from datetime import timedelta
from factory import fuzzy
from django.test import TestCase
from django.urls import reverse

from app.models import Wanderverse, Verse, Total


def create_sentence(min_word_length=3, max_word_length=6):
    sentence = ""
    random_word_length = random.randint(min_word_length, max_word_length)
    for i in range(0, random_word_length):
        random_char_length = random.randint(0, 20)
        sentence += fuzzy.FuzzyText(length=random_char_length).fuzz() + " "
    return sentence.strip()


class BaseTests(TestCase):
    """
    Test cases for the brightness, dominant color recognition, and tempo finding private functions
    """

    def setUp(self):
        for _ in range(3):
            w = Wanderverse.objects.create()
            for _ in range(5):
                Verse.objects.create(text=create_sentence(max_word_length=10), wanderverse=w,
                                     verified=True)
        assert Wanderverse.objects.count() == 3

    def test_simple(self):
        self.assertEqual(2 + 2, 4)

    def test_play(self):
        response = self.client.get(reverse("play_wanderverse"))
        assert response.status_code == 200
        assert "exquisite_verse" in response.content.decode()

    def test_add_verse(self):
        wanderverse_id = 2
        w = Wanderverse.objects.get(id=wanderverse_id)
        w_length = w.verse_set.count()
        total_wanderverse_count = Wanderverse.objects.count()
        data = {
            "id": wanderverse_id,
            "verse": create_sentence(),
            "book_title": create_sentence(max_word_length=3),
            "author": create_sentence(min_word_length=1, max_word_length=2),
            "genre": create_sentence(min_word_length=1, max_word_length=1),
            "page_number": str(fuzzy.FuzzyInteger(0, 200).fuzz()),
            "last_verse": w.verse_set.last().text,
            "start_new": "false"
        }

        response = self.client.post(reverse("add_verse"), json.dumps(data),
                                    content_type="application/json")
        assert response.status_code == 200
        # assert that we have added a new verse, extended the Wanderverse
        # but that we haven't added a new Wanderverse object

        w = Wanderverse.objects.get(id=wanderverse_id)
        assert w.verse_set.count() == w_length + 1
        # Wanderverse count remains the same
        assert Wanderverse.objects.count() == total_wanderverse_count

        w.refresh_from_db()

        # update for new length
        w_length = w_length + 1

        new_verse = "This is a valid sentence"
        # Make sure the last verse is verified
        last = w.verse_set.last()
        last.verified = True
        last.save()
        # Start new Wanderverse
        data["start_new"] = "true"
        data["verse"] = new_verse
        data["last_verse"] = last.text

        response = self.client.post(reverse("add_verse"),
                                    json.dumps(data),
                                    content_type="application/json")

        assert response.status_code == 200

        # assert that we have added a new Wanderverse
        w = Wanderverse.objects.get(id=wanderverse_id)
        assert w.verse_set.count() == w_length + 1
        assert Wanderverse.objects.count() == total_wanderverse_count + 1

        # assert that we have two wanderverses with the same verse
        verses = Verse.objects.filter(text=new_verse)
        assert verses.count() == 2

        # assert that only one verse exists in the newly created one
        new_wanderverse = verses.last().wanderverse \
            if verses.first().wanderverse.id == w.id \
            else verses.first().wanderverse

        assert new_wanderverse.verse_set.count() == 1

        # test add verse without page number
        data.pop("page_number", None)
        assert "page_number" not in data
        response = self.client.post(reverse("add_verse"), json.dumps(data),
                                    content_type="application/json")
        assert response.status_code == 200

    def test_get_new_random(self):
        response = self.client.get(reverse("wanderverse_random"))
        res = response.json()
        assert len(res["w"]) > 0
        assert res["id"] > -1

    def test_get_new_and_exclude(self):
        w = Wanderverse.objects.first()
        last_verified = w.last_verified()
        response = self.client.get(reverse("wanderverse_exclude", args=(last_verified.text,)))
        res = response.json()
        assert res["w"] is not last_verified.text


class VerifyTests(TestCase):
    def setUp(self):
        w = Wanderverse.objects.create()
        for _ in range(3):
            Verse.objects.create(text=create_sentence(max_word_length=10),
                                 wanderverse=w,
                                 verified=True)
        # add unverified verse
        Verse.objects.create(text=create_sentence(max_word_length=10), wanderverse=w)

    def test_verified_play(self):
        wanderverse = Wanderverse.objects.get(id=1)
        last_unverified = wanderverse.verse_set.last()
        last_verified = wanderverse.verse_set.filter(verified=True).last()

        response = self.client.get(reverse("play_wanderverse"))
        decoded = response.content.decode()

        assert last_unverified.text not in decoded
        assert last_verified.text in decoded

        # verify verse
        last_unverified.verified = True
        last_unverified.save()
        wanderverse.refresh_from_db()
        now_verified = wanderverse.verse_set.last()

        # sanity check for renaming
        assert now_verified == last_unverified

        response = self.client.get(reverse("play_wanderverse"))
        decoded = response.content.decode()

        assert now_verified.text in decoded

    def test_add_verse_verified(self):
        wanderverse_count = Wanderverse.objects.count()
        verse_count = Verse.objects.count()
        wanderverse = Wanderverse.objects.get(id=1)
        verified_verse_count = len(wanderverse.verse_objects_valid())

        # getting last verified verse
        last_verified = wanderverse.exquisite()
        valid_text = "A valid verse 123"
        data = {
            "id": wanderverse.id,
            "verse": valid_text,
            "book_title": "A valid book title",
            "author": "A valid author",
            "last_verse": last_verified.text,
            "genre": "",
            "start_new": "false"
        }

        response = self.client.post(reverse("add_verse"), json.dumps(data),
                                    content_type="application/json")

        assert response.status_code == 200
        wanderverse.refresh_from_db()

        assert Wanderverse.objects.count() == wanderverse_count
        assert Verse.objects.count() == verse_count + 1
        # the verified count has not changed
        assert len(wanderverse.verse_objects_valid()) == verified_verse_count

        newly_added_verse = Verse.objects.get(text=valid_text)
        assert newly_added_verse.verified is False

        newly_added_verse.verified = True
        newly_added_verse.save()
        assert len(wanderverse.verse_objects_valid()) == verified_verse_count + 1

    def test_length(self):
        wanderverse_count = Wanderverse.objects.count()
        wanderverse = Wanderverse.objects.get(id=1)
        long_text = """
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
            A valid but very long verse.
        """
        assert len(long_text) > 500
        last_verse = wanderverse.verse_set.filter(verified=True).last().text
        data = {
            "id": wanderverse.id,
            "verse": long_text.strip(),
            "book_title": create_sentence(max_word_length=3),
            "author": create_sentence(min_word_length=1, max_word_length=2),
            "last_verse": last_verse,
            "genre": "",
            "start_new": "true"
        }

        response = self.client.post(reverse("add_verse"), json.dumps(data),
                                    content_type="application/json")
        assert response.status_code == 422

        r = response.json()
        assert r["valid"] is False

        # count has not changed
        assert Wanderverse.objects.count() == wanderverse_count

        # Test book title length
        data["verse"] = create_sentence()
        data["book_title"] = long_text

        response = self.client.post(reverse("add_verse"), json.dumps(data),
                                    content_type="application/json")
        assert response.status_code == 422

        message = response.json()['message']
        assert message == 'Error! This text is too long. Maximum length: 500 characters.'

        # Test genre length
        data["book_title"] = create_sentence()
        data["genre"] = long_text

        response = self.client.post(reverse("add_verse"), json.dumps(data),
                                    content_type="application/json")
        assert response.status_code == 422

    def test_count(self):
        original_wanderverse_count = Wanderverse.all_valid().count()
        Total.update(count_now=True)
        original_totals = Total.objects.first()
        count_response = self.client.get(reverse("count"))
        assert count_response.status_code == 200
        assert original_totals.wanderverse == Total.objects.first().wanderverse
        assert Total.objects.count() == 1

        # creation of new wanderverse should not update count
        w = Wanderverse.objects.create()
        Verse.objects.create(verified=True, wanderverse=w)
        assert Wanderverse.all_valid().count() == original_wanderverse_count + 1

        count_response = self.client.get(reverse("count"))
        assert count_response.status_code == 200
        assert Total.objects.first().wanderverse == original_totals.wanderverse
        assert Total.objects.count() == 1

        # subtract an hour from date
        totals = Total.objects.first()
        totals.date = totals.date - timedelta(seconds=3600)
        totals.save()

        original_date = totals.date

        count_response = self.client.get(reverse("count"))
        assert count_response.status_code == 200

        # assert that we have updated the count
        assert Total.objects.first().wanderverse == original_totals.wanderverse + 1
        assert Total.objects.count() == 1

        # assert that the date has been updated
        assert Total.objects.first().date >= original_date + timedelta(seconds=3600)
