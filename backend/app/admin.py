"""
This file controls the administrative interface for the web app.
"""

from django.contrib import admin

from app.models import Verse, Wanderverse


def verify(modeladmin, request, queryset):
    queryset.update(verified=True)


@admin.register(Verse)
class VerseAdmin(admin.ModelAdmin):
    list_display = ['id', 'text', 'verified', 'wanderverse_id', 'date']
    actions = [verify]


@admin.register(Wanderverse)
class WanderverseAdmin(admin.ModelAdmin):
    list_display = ['id', 'exquisite']
