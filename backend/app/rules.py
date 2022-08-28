import os
import json
import random
from django.conf import settings
from django.db.models import Q

from app.models import Rules, Rule, Total
from app.helpers import get_suffix

steps_keys = ["start", "floor", "bookshelf", "shelf", "book", "page", "end"]

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
        return f"Go to Row/bookshelf {choice + 1}."

    suffixed = get_suffix(choice + 1)
    if step == "shelf":
        return f"Find the {suffixed} shelf."
    if step == "book":
        return f"Pick up the {suffixed} book you see."

    if step == "page":
        return f"Flip to the {suffixed} page."

    return ""


def create_rules(count=1000, location="a"):
    i = 0
    if location == "a":
        rule_steps = Rule.objects.filter(location="a")
    elif location == "b":
        rule_steps = Rule.objects.filter(Q(location="b") | Q(location="a"))
    elif location == "c" or location == "d":
        rule_steps = Rule.objects.filter(
            Q(location=location, step=steps_keys[0]) |
            Q(location=location, step=steps_keys[1]) |
            Q(location=location, step=steps_keys[2]) |
            Q(location=location, step=steps_keys[3]) |
            Q(location=location, step=steps_keys[4]) |
            Q(location=location, step=steps_keys[5]) |
            Q(location=location, step=steps_keys[6]) |
            Q(location="a", step=steps_keys[4]) |
            Q(location="a", step=steps_keys[5]) |
            Q(location="a", step=steps_keys[6])
        )

    while i < count:
        rule_list = []
        for key in steps_keys:
            filtered_steps = rule_steps.filter(step=key)
            possible_choices = filtered_steps.count()
            if possible_choices > 1:
                print("choice count", possible_choices, key)
                random_int = roll_dice(possible_choices)
                rule_list.append(filtered_steps[random_int].text)

        r = Rules.objects.create(list=rule_list, location=location)
        r.save()
        i += 1
    total = Total.objects.first()
    total.rules = {
        "a": 0,
        "b": 0,
        "c": 0,
        "d": 0
    }
    for location in ["a", "b", "c", "d"]:
        total.rules[location] = Rules.objects.filter(location=location).count()
    total.save()
