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
                                                                               "Cafeteria",
          "Admire the view from the expansive windows of the Hayden Library."],
    # downstairs floor
    "1": ["Go to the stacks floor of Hayden Library.", "Descend to the bowels of Hayden library",
          "Where are the stacks? We must find them."]
}

position = {
    # main floor
    "0": ["Are you on the side of the Cafeteria? Stroll to the other side.", "Find the "
                                                                             "...something"],
    "1": ["Walk to the middle of the room.", "So many stacks! Find your favorite one."]
}

choices = {
    "floor": floor,
    "position": position
}


class Rules:
    def __init__(self):
        self.step = 0
        self.floor = ["main", "downstairs"]
        self.main_side = ["Go to the stacks on the side of the cafeteria", "Go to the stacks "
                                                                           "behind the cafeteria"]
        self.downstairs_stacks_num = 249
        self.main_stacks_num = 5
        self.main_shelf_num = 3
        self.downstairs_shelf_num = 6
        self.book_nums = 10
        self.triple = ["beginning", "middle", "end"]
        self.top_or_bottom = ["top", "bottom"]
        self.all = []
        # choose floor
        # if self.floor == 0:
        #     self.rules_for_main_floor()
        # elif self.floor == 1:
        #     self.rules_for_downstairs()
        self.floor = roll_dice(sides=2)
        self.all.append(self.choose("floor"))
        self.all.append(self.choose("position"))

        # choose book num
        book_num = random.randint(1, self.book_nums)
        suffixed_num = f"{get_suffix(book_num)}"
        self.all.append(f"Get the {suffixed_num} book you see from the shelf.")
        self.step = 4
        # choose part of book
        book_part = random.choice(self.triple)
        self.all.append(f"Flip to the {book_part} of the book")
        self.step = 5
        # phrase instruction
        self.all.append(
            "Find a sentence or a fragment of a sentence that you like to continue the poem.")
        self.step = 6

    def rules_for_main_floor(self):
        # choose stacks side if on main floor
        side = random.choice(self.main_side)
        self.all.append(side)
        # choose stack num
        stacks_num = random.randint(1, self.main_stacks_num)
        self.all.append(f"Go to stack number {stacks_num}")
        self.step = 2
        # choose shelf num
        shelf_num = random.randint(1, self.main_shelf_num)
        direction = random.choice(self.top_or_bottom)
        shelf_suffixed = f"{get_suffix(shelf_num)}"
        self.all.append(f"Look at the {shelf_suffixed} shelf from the {direction}")
        self.step = 3

    def rules_for_downstairs(self):
        # choose stack num
        stacks_num = random.randint(1, self.downstairs_stacks_num)
        self.all.append(f"Go to stack number {stacks_num}")
        self.step = 2
        # choose shelf num
        shelf_num = random.randint(1, self.downstairs_shelf_num)
        direction = random.choice(self.top_or_bottom)
        shelf_suffixed = f"{get_suffix(shelf_num)}"
        self.all.append(f"Look at the {shelf_suffixed} shelf from the {direction}")
        self.step = 3

    def choose_book(self):
        choice = roll_dice()
        if choice == 0:
            self.robot_rules()

    def robot_rules(self):
        pass

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
