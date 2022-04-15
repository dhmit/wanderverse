import random
from app.helpers import get_suffix

steps = ["start", "floor", "stack", "shelf", "book", "page", "end"]


def roll_dice(sides=6):
    # zero based
    return random.randint(0, sides - 1)


floor = {
    # main floor
    "0": ["Find yourself on the main floor of Hayden Library.", "Amble around the library on the "
                                                                "first floor", "Navigate to the "
                                                                               "Courtyard Cafe.",
          "Admire the view from the expansive windows of the Hayden Library."],
    # downstairs floor
    "1": ["Go to the stacks floor of Hayden Library.",
          "Descend to the bowels of Hayden Library.",
          "Where are the stacks? We must find them."]
}

stack = {
    # main floor
    "0": ["Are you on the side of the Courtyard Cafe? Stroll to the other side.",
          # "Scurry towards the Courtyard Cafe.",
          "Walk to the middle of the room.",
          "Go to the stacks on the side of the Courtyard Cafe",
          "Go to the stacks behind the Cafeteria",
          "function:robot"],
    "1": ["Walk to the middle of the room.", "So many stacks! Find your favorite one.",
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

book_options = ["Find a big book.", "Pick up a small book.",
                "Search for a book whose jacket is closest to your favorite color.",
                "Find a book with the loveliest title.",
                "Find a book with a title that reminds you of yesterday.",
                "Find a book with a title that reminds you of your favorite person.",
                "Find a book with a title that sounds heavy.",
                "Find an orange book.",
                "Find a book with a title that sounds light.",
                "Find the book that finds you.",
                "Find a blue book.",
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


class Rules:
    def __init__(self):
        self.all = []
        self.floor = roll_dice(sides=2)
        choice = self.choose("floor")
        choice = self.expand(choice, "floor")
        self.all.append(choice)
        # choice = self.choose("stack")
        # choice = self.expand(choice, "position")
        # self.all.append(choice)
        steps_to_take = roll_dice(3)

        # if steps_to_take is 0, we just need to pick a book

        where_we_end = self.choose("end")
        where_we_end = self.expand(where_we_end, "end")

        if steps_to_take == 0:
            choice = self.choose("book")
            choice = self.expand(choice, "book")
            self.all.append(choice)
            self.all.append(where_we_end)
            return

        # if steps_to_take is 1, stack + book
        choice = self.choose("stack")
        choice = self.expand(choice, "stack")
        self.all.append(choice)
        choice = self.choose("book")
        choice = self.expand(choice, "book")
        self.all.append(choice)
        if steps_to_take == 1:
            self.all.append(where_we_end)
            return

        # if steps_to_take is 2, stack + book + part of book
        choice = self.choose("book_part")
        choice = self.expand(choice, "book_part")
        self.all.append(choice)
        self.all.append(where_we_end)
        return

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

    def robot_rules(self, step):
        if step == "book_part":
            choice = roll_dice(sides=len(options[str(self.floor)][step]))
            return f"Flip to the {options[str(self.floor)][step][choice]} of the book."

        num_of_options = options[str(self.floor)][step]
        choice = roll_dice(num_of_options)
        if step == "stack":
            return f"Go to stack number {choice + 1}."

        suffixed = get_suffix(choice)
        if step == "book":
            return f"Pick up the {suffixed} book you see."

        return ""

    def __str__(self):
        return "\\".join(self.all)

    def choose(self, place):
        length_of_possible_choices = len(choices[place][str(self.floor)])
        choice = roll_dice(sides=length_of_possible_choices)
        return choices[place][str(self.floor)][choice]


def meta_rules():
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

    pass
