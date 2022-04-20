import random
from app.helpers import get_suffix

from django.db import models

# robot options
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

steps = ["start", "floor", "stack", "shelf", "book", "page", "end"]

floor = {
    # main floor
    "0": ["Find yourself on the main floor of Hayden Library.", "Amble around the library on the "
                                                                "first floor", "Navigate to the "
                                                                               "Courtyard Cafe.",
          "Find the circulation desk.",
          "Admire the view from the expansive windows of the Hayden Library."],
    # downstairs floor
    "1": ["Go to the stacks floor of Hayden Library.",
          "Descend to the bowels of Hayden Library.",
          "Where are the stacks? We must find them. (pssst they're in the basement)"]
}

stack = {
    # main floor
    "0": ["Are you on the side of the Courtyard Cafe? Stroll to the other side.",
          # "Scurry towards the Courtyard Cafe.",
          "Walk to the middle of the room.",
          "Go to the stacks on the side of the Courtyard Cafe",
          "Go to the stacks behind the Cafeteria",
          "function:robot"],
    "1": ["Walk to the middle of the room.",
          "So many stacks! Find your favorite one.",
          "Go to the fifth stack on your right",
          "Zig zag through the stacks",
          "Go to the closest stack.", "Get to the stack across the room.",
          "function:robot"]
}

shelf = {
    "0": ["function:robot"],
    "1": ["function:robot"]
}

book = {
    "0": ["function:robot"],
    "1": ["function:robot"]
}

book_options = ["Find a big book.",
                "Pick up a small book.",
                "Search for a book whose jacket is closest to your favorite color.",
                "Find a book with the loveliest title.",
                "Find a book with a title that reminds you of yesterday.",
                "Find a book with a title that reminds you of your favorite person.",
                "Find a book with a title that sounds heavy.",
                "Find a book with a title that sounds light.",
                "Find a blue book.",
                "Find an orange book.",
                "Find a red book.",
                "Find a strange book",
                "Find the book that finds you.",
                "Pick up a book with a jacket the color of the sky.",
                "Pick up a book that looks like it has the answer."]

book["0"] += book_options
book["1"] += book_options

book_part = {
    "0": ["function:robot"],
    "1": ["function:robot"]
}

book_part_options = ["Flip to a random page. Do it again.",
                     "Flip to a random page. Do it again, and again.",
                     "Flip to a random page. Do it again, and again, and once more.",
                     "Flip three pages from the back.",
                     "Go to page twelve."]

book_part["0"] += book_part_options
book_part["1"] += book_part_options
end = {
    "0": ["Find a sentence or a fragment of a sentence that you like to continue the Wanderverse."],
    "1": ["Find a sentence or a fragment of a sentence that you like to continue the Wanderverse."]
}
choices = {
    "floor": floor,
    "stack": stack,
    "shelf": shelf,
    "book": book,
    "book_part": book_part,
    "end": end,
}


class Wanderverse(models.Model):
    id = models.BigAutoField(primary_key=True)

    def __str__(self):
        return "\\".join(self.verse_set.all().order_by('id').values_list('text', flat=True))

    def exquisite(self):
        # return last verse only
        return self.verse_set.order_by('id').last()

    def verse_objects(self):
        return list(self.verse_set.order_by('id').values('id', 'text', 'author', 'page_number',
                                                         'book_title'))

    def verse_objects_valid(self):
        # TODO: fix breaking up poems!
        return list(self.verse_set.filter(verified=True)
                    .order_by('id').values('id',
                                           'text',
                                           'author',
                                           'page_number',
                                           'book_title'))

    @classmethod
    def all_valid(cls):
        """Get all instances with at least one verified verse"""
        return cls.objects.filter(verse__verified=True)

    def last_verified(self):
        return self.verse_set.order_by('id').filter(verified=True).last()


class Verse(models.Model):
    id = models.BigAutoField(primary_key=True)
    text = models.TextField(blank=True, null=True)
    wanderverse = models.ForeignKey('Wanderverse', blank=True, null=True,
                                    on_delete=models.DO_NOTHING)
    date = models.DateTimeField(auto_now_add=True)
    author = models.TextField(blank=True, null=False)
    page_number = models.IntegerField(blank=True, null=True)
    book_title = models.TextField(blank=True, null=False)
    genre = models.TextField(blank=True, null=True)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return str(self.text)


class Rules(models.Model):
    """Figuring out complicated rules so that random functions can stop being called
        - Create number that is at least 3 length
        - At most 6 length

        - 3:
            - floor
            - position
            - book

        - 4:
            - floor
            - position
            - stack
            - book

        - 5:
            - floor
            - stack
            - shelf
            - book
            - part of book
        """

    list = models.JSONField()

    def save(self, *args, **kwargs):
        if not self.pk:
            self.list = []
            self.floor = self.roll_dice(sides=2)
            choice = self.choose("floor")
            choice = self.expand(choice, "floor")
            self.list.append(choice)
            # choice = self.choose("stack")
            # choice = self.expand(choice, "position")
            # self.all.append(choice)
            steps_to_take = self.roll_dice(sides=6, min_sides=3)

            # if steps_to_take is 0, we just need to pick a book

            where_we_end = self.choose("end")
            where_we_end = self.expand(where_we_end, "end")

            if steps_to_take == 0:
                choice = self.choose("book")
                choice = self.expand(choice, "book")
                self.list.append(choice)
                self.list.append(where_we_end)
                return

            # if steps_to_take is 1, stack + book
            choice = self.choose("stack")
            choice = self.expand(choice, "stack")
            self.list.append(choice)
            choice = self.choose("book")
            choice = self.expand(choice, "book")
            self.list.append(choice)
            if steps_to_take == 1:
                self.list.append(where_we_end)
                return

            # if steps_to_take is 2, stack + book + part of book
            choice = self.choose("book_part")
            choice = self.expand(choice, "book_part")
            self.list.append(choice)
            self.list.append(where_we_end)

        super(Rules, self).save(*args, **kwargs)

    def choose(self, place):
        length_of_possible_choices = len(choices[place][str(self.floor)])
        choice = self.roll_dice(sides=length_of_possible_choices)
        return choices[place][str(self.floor)][choice]

    def roll_dice(self, sides=6, min_sides=0):
        # zero based
        return random.randint(min_sides, sides - 1)

    def expand(self, choice, step):
        """Run function if function chosen"""
        if "function" not in choice:
            return choice
        func_name = choice.split("function:")[1]
        # return func_name
        if func_name == "robot":
            return self.robot_rules(step)
        return func_name

    def robot_rules(self, step):
        if step == "book_part":
            choice = self.roll_dice(sides=len(options[str(self.floor)][step]))
            return f"Flip to the {options[str(self.floor)][step][choice]} of the book."

        num_of_options = options[str(self.floor)][step]
        choice = self.roll_dice(num_of_options)
        if step == "stack":
            return f"Go to stack number {choice + 1}."

        suffixed = get_suffix(choice)
        if step == "book":
            return f"Pick up the {suffixed} book you see."

        return ""

    def choose_book(self):
        # TODO: create more choices for book step
        # choice = roll_dice()
        # if choice == 0:
        self.robot_rules("book")

    def expand(self, choice, step):
        """Run function if function chosen"""
        if "function" not in choice:
            return choice
        func_name = choice.split("function:")[1]
        # return func_name
        if func_name == "robot":
            return self.robot_rules(step)
        return func_name
