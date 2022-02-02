# pylint: disable-msg = C0116
# pylint: disable-msg = E0401
# ignoring pylint's `missing-function-docstring` errors
import json
import random
from factory import fuzzy
from django.test import TestCase
from django.urls import reverse

from app.views import play
from app.models import Wanderverse, Verse


def create_sentence(max_word_length=3):
    sentence = ""
    random_word_length = random.randint(1, max_word_length)
    for i in range(0, random_word_length):
        random_char_length = random.randint(0, 20)
        sentence += fuzzy.FuzzyText(length=random_char_length).fuzz() + " "
    return sentence.strip()


class MainTests(TestCase):
    """
    Test cases for the brightness, dominant color recognition, and tempo finding private functions
    """

    def setUp(self):
        for _ in range(3):
            w = Wanderverse.objects.create()
            for _ in range(5):
                Verse.objects.create(text=create_sentence(max_word_length=10), wanderverse=w)
        assert Wanderverse.objects.count() == 3

    def test_simple(self):
        self.assertEqual(2 + 2, 4)

    def test_play(self):
        request = self.client.get(reverse("play_wanderverse"))
        response = play(request)
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
            "title": create_sentence(max_word_length=3),
            "author": create_sentence(max_word_length=2),
            "genre": create_sentence(max_word_length=1),
            "page_number": fuzzy.FuzzyInteger(0, 200).fuzz(),
            "last_verse": w.verse_set.last().text,
            "start_new": "false"
        }

        response = self.client.post(reverse("add_verse"), json.dumps(data),
                                    content_type="application/json")
        print("getting response?", response.json(), response.status_code)
        assert response.status_code == 200
        # assert that we have extended the wanderverse
        w = Wanderverse.objects.get(id=wanderverse_id)
        assert w.verse_set.count() == w_length + 1
        assert Wanderverse.objects.count() == total_wanderverse_count

        w.refresh_from_db()

        data["start_new"] = "true"
        data["verse"] = create_sentence()
        data["last_verse"] = w.verse_set.last().text

        response = self.client.post(reverse("add_verse"), json.dumps(data),
                                    content_type="application/json")

        assert response.status_code == 200
        # assert that we have extended the wanderverse
        w = Wanderverse.objects.get(id=wanderverse_id)
        assert w.verse_set.count() == w_length + 2
        assert Wanderverse.objects.count() == total_wanderverse_count + 1
