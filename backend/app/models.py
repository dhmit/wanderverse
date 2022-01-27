from django.db import models


class Wanderverse(models.Model):
    id = models.BigAutoField(primary_key=True)

    def __str__(self):
        return "\\".join(self.verse_set.all().order_by('id').values_list('text', flat=True))

    def exquisite(self):
        return self.verse_set.order_by('id').last()


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

    def __str__(self):
        return self.text
