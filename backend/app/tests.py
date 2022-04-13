# pylint: disable-msg = C0116
# pylint: disable-msg = E0401
# ignoring pylint's `missing-function-docstring` errors
import json
import random
from factory import fuzzy
from django.test import TestCase
from django.urls import reverse

from app.models import Wanderverse, Verse


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

        # Start new Wanderverse
        data["start_new"] = "true"
        data["verse"] = create_sentence()
        data["last_verse"] = w.verse_set.last().text

        response = self.client.post(reverse("add_verse"),
                                    json.dumps(data),
                                    content_type="application/json")

        assert response.status_code == 200

        # assert that we have added a new Wanderverse
        w = Wanderverse.objects.get(id=wanderverse_id)
        assert w.verse_set.count() == w_length + 2
        assert Wanderverse.objects.count() == total_wanderverse_count + 1


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
        wanderverse = Wanderverse.objects.get(id=1)
        last_verified = wanderverse.verse_set.filter(verified=True).last()

        new_verse_text = create_sentence()

        data = {
            "id": wanderverse.id,
            "verse": new_verse_text,
            "book_title": create_sentence(max_word_length=3),
            "author": create_sentence(min_word_length=1, max_word_length=2),
            "last_verse": last_verified.text,
            "genre": "",
            "start_new": "false"
        }

        response = self.client.post(reverse("add_verse"), json.dumps(data),
                                    content_type="application/json")
        assert response.status_code == 200
        assert Wanderverse.objects.count() == wanderverse_count + 1

    def test_length(self):
        wanderverse_count = Wanderverse.objects.count()
        wanderverse = Wanderverse.objects.get(id=1)
        long_text = """
            Optio consequatur eligendi laudantium voluptatibus repellat aperiam.
            Dolores velit earum quo voluptatem quis sit. Eligendi eveniet est sint omnis et cum.
            Architecto est dolorem hic. Voluptas ut sunt natus dolor eaque ex.
            Quia illum et consequatur suscipit esse illo eveniet impedit.
            Porro nostrum officia quidem iusto est debitis voluptatem. Nemo velit qui ipsam autem.
            Doloribus et similique veritatis perferendis dolorem sequi et.
            In error qui necessitatibus fugit. Eos saepe et atque velit illum et laudantium.
            Assumenda voluptatem ab inventore nulla voluptatem minima voluptate sit.
            Tempora similique est voluptates quas enim sed qui minima. Culpa delectus molestias eos.
            Quia esse reprehenderit porro dolores et. Vero magnam quibusdam aut nulla quis.
            Optio minima laudantium facilis a et quod ut omnis.
            Blanditiis laboriosam voluptatem et sit dolores. Omnis sint eius qui.
            Molestiae illum rem praesentium.
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

        # Test genre length
        data["book_title"] = create_sentence()
        data["genre"] = long_text

        response = self.client.post(reverse("add_verse"), json.dumps(data),
                                    content_type="application/json")
        assert response.status_code == 422
