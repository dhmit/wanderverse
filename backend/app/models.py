import json
import random

from django.utils import timezone
from django.db import models


class Wanderverse(models.Model):
    id = models.BigAutoField(primary_key=True)

    def __str__(self):
        return "\\".join(self.verse_set.all().order_by('date').values_list('text', flat=True))

    def exquisite(self):
        """Returns last verified verse"""
        return self.verse_set.filter(verified=True).order_by('date').last()

    def verse_objects(self):
        return list(
            self.verse_set.order_by('date', 'id')
                .values('id', 'text', 'author', 'page_number', 'book_title'))

    def verse_objects_valid(self):
        # TODO: fix breaking up poems!
        return list(self.verse_set.filter(verified=True)
                    .order_by('date', 'id').values('id',
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

    class Meta:
        indexes = [
            models.Index(fields=['date'], name='date_idx'),
        ]

    def __str__(self):
        return str(self.text)


class Rule(models.Model):
    # TODO:
    # -- random outside of library instructions
    # -- only first floor instructions
    # location = [default, 1st_floor, elsewhere]
    # robot options
    CHOICES = (
        ('a', 'default'),
        ('b', 'hayden:default'),
        ('c', 'hayden:main'),
        ('d', 'hayden:stacks'),
    )
    location = models.CharField(max_length=1, choices=CHOICES)
    text = models.CharField(max_length=1000)
    step = models.CharField(max_length=100)


class Rules(models.Model):
    CHOICES = (
        ('a', 'default'),
        ('b', 'hayden:default'),
        ('c', 'hayden:main'),
        ('d', 'hayden:stacks'),
    )
    list = models.JSONField()
    location = models.CharField(max_length=1, choices=CHOICES)


class Total(models.Model):
    wanderverse = models.IntegerField(default=0)
    rules = models.JSONField(default={})
    date = models.DateTimeField()

    @classmethod
    def update(cls, count_now=False):
        # only run this once a day
        HOUR = 3600  # 1 hour
        time_now = timezone.now()
        if not cls.objects.first():
            cls.objects.create(date=timezone.now())

        # either count now or once every hour
        if count_now or (time_now - cls.objects.first().date).seconds >= HOUR:
            obj = cls.objects.first()
            obj.date = timezone.now()
            obj.wanderverse = Wanderverse.all_valid().count()
            for location in ["a", "b", "c", "d"]:
                obj.rules[location] = Rules.objects.filter(location=location).count()

            print(obj)
            obj.save()

    @classmethod
    def count(cls):
        count_obj = cls.objects.first()
        if type(count_obj.rules) is str:
            rules_count = json.loads(count_obj.rules)
        else:
            rules_count = count_obj.rules
        return {
            "wanderverses": count_obj.wanderverse,
            "rules": rules_count,
            "date": count_obj.date
        }


def get_random_instance(obj, qs):
    Total.update()
    totals = Total.count()
    if obj == "rules_default":
        count = totals["rules"]["a"] + totals["rules"]["b"]
    else:
        count = totals[obj]
    rand = random.randint(0, count)
    return qs[rand]
