import random
from app.helpers import get_suffix


class Rules:

    def __init__(self):
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
        floor = random.choice(self.floor)
        if floor == "main":
            self.rules_for_main_floor()
        elif floor == "downstairs":
            self.rules_for_downstairs()

        # choose book num
        book_num = random.randint(1, self.book_nums)
        suffixed_num = f"{get_suffix(book_num)}"
        self.all.append(f"Get the {suffixed_num} book you see")
        # choose part of book
        book_part = random.choice(self.triple)
        self.all.append(f"Flip to the {book_part} of the book")
        # phrase instruction
        self.all.append(
            "Find a sentence or a fragment of a sentence that you like to continue the poem.")

    def rules_for_main_floor(self):
        self.all.append("Find yourself on the main floor of Hayden Library.")
        # choose stacks side if on main floor
        side = random.choice(self.main_side)
        self.all.append(side)
        # choose stack num
        stacks_num = random.randint(1, self.main_stacks_num)
        self.all.append(f"Go to stack number {stacks_num}")
        # choose shelf num
        shelf_num = random.randint(1, self.main_shelf_num)
        direction = random.choice(self.top_or_bottom)
        shelf_suffixed = f"{get_suffix(shelf_num)}"
        self.all.append(f"Look at the {shelf_suffixed} shelf from the {direction}")

    def rules_for_downstairs(self):
        self.all.append("Go to the stacks floor of Hayden Library.")
        # choose stack num
        stacks_num = random.randint(1, self.downstairs_stacks_num)
        self.all.append(f"Go to stack number {stacks_num}")
        # choose shelf num
        shelf_num = random.randint(1, self.downstairs_shelf_num)
        direction = random.choice(self.top_or_bottom)
        shelf_suffixed = f"{get_suffix(shelf_num)}"
        self.all.append(f"Look at the {shelf_suffixed} shelf from the {direction}")

    def __str__(self):
        return "\\".join(self.all)
