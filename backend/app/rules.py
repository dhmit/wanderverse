import os
import json
import random
from django.conf import settings
from app.models import Rules, Rule, Total
from app.helpers import get_suffix

# steps = ["start", "floor", "bookshelf", "shelf", "book", "page", "end"]
#
# choices = {
#     "floor": floor,
#     "stack": stack,
#     "shelf": shelf,
#     "book": book,
#     "book_part": book_part,
#     "end": end,
# }

options = {
    "0": {
        "genres": ["Travel section"],
        "stack": 5,
        "shelf": 3,
        "book": 10,
        "book_part": ["beginning", "middle", "end"],

    },
    "1": {
        "stack": 249,
        "shelf": 6,
        "book": 10,
        "book_part": ["beginning", "middle", "end"],

    }
}
LOCATIONS = {'default': 'a',
             'hayden:default': 'b',
             'hayden:main': 'c',
             'hayden:stacks': 'd'}


def create_steps():
    with open(os.path.join(settings.BACKEND_DIR, "app/data/rules.json"), "r") as f:
        steps = json.load(f)
    for step in steps.keys():
        for location in steps[step].keys():
            for instruction in steps[step][location]:
                if instruction == "function:robot":
                    if step == "shelf":
                        if location == "hayden:main":
                            text = robot_rules(step, sides=3)
                        elif location == "hayden:stacks":
                            text = robot_rules(step, sides=6)
                    elif step == "bookshelf":
                        if location == "hayden:main":
                            text = robot_rules(step, sides=5)
                        elif location == "hayden:stacks":
                            text = robot_rules(step, sides=249)
                    elif step == "book":
                        if location == "default":
                            text = robot_rules(step, sides=10)
                    elif step == "page":
                        if location == "default":
                            text = robot_rules(step, sides=100)
                    Rule.objects.create(text=text,
                                        location=LOCATIONS[location],
                                        step=step)
                else:
                    Rule.objects.create(text=instruction,
                                        location=LOCATIONS[location],
                                        step=step)


def roll_dice(sides=6, min_sides=0):
    # zero based
    return random.randint(min_sides, sides - 1)


def robot_rules(step, sides):
    choice = roll_dice(sides=sides)
    if step == "bookshelf":
        return f"Go to Row {choice + 1}."

    suffixed = get_suffix(choice + 1)
    if step == "shelf":
        return f"Find the {suffixed} shelf."
    if step == "book":
        return f"Pick up the {suffixed} book you see."

    if step == "page":
        return f"Flip to the {suffixed} page."

    return ""


def create_rules(count=1000):
    i = 0
    while i < count:
        r = Rules.objects.create()
        r.save()
        i += 1
    total = Total.objects.first()
    total.rules = Rules.objects.count()
    total.save()
