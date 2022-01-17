from django.db import models


class Wanderverse(models.Model):
    id = models.BigAutoField(primary_key=True)

    def __str__(self):
        return self.verse_set.all().order_by('id')


class Verse(models.Model):
    id = models.BigAutoField(primary_key=True)
    text = models.TextField(blank=True, null=True)
    wanderverse = models.ForeignKey('Wanderverse', blank=True, null=True,
                                    on_delete=models.DO_NOTHING)
    date = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.text
