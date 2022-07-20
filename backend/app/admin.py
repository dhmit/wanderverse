"""
This file controls the administrative interface for the web app.
"""
from django.contrib import admin
from django.urls import reverse
from django.utils.safestring import mark_safe

from app.models import Verse, Wanderverse, Rules, Rule


def verify(modeladmin, request, queryset):
    queryset.update(verified=True)


def unverify(modeladmin, request, queryset):
    queryset.update(verified=False)


@admin.register(Verse)
class VerseAdmin(admin.ModelAdmin):
    list_display = ['id', 'text', 'preview', 'verified', 'w_id', 'author', 'book_title',
                    'genre', 'date']

    def w_id(self, obj):
        return obj.wanderverse_id

    def preview(self, obj):
        if not obj.verified:
            return mark_safe('<a href="{}">preview</a>'.format(
                "https://wanderverse.dhlab.mit.edu/read/?id=" + str(obj.wanderverse.id) +
                "&submitted=" + str(obj.pk)
            ))
        else:
            return mark_safe('<a href="{}">published</a>'.format(
                "https://wanderverse.dhlab.mit.edu/read/?id=" + str(obj.wanderverse.id)
            ))

    actions = [verify, unverify]


@admin.register(Rules)
class RulesAdmin(admin.ModelAdmin):
    list_display = ['list']


class VerseInline(admin.TabularInline):
    model = Verse


@admin.register(Wanderverse)
class WanderverseAdmin(admin.ModelAdmin):
    list_display = ['id', 'total_verses', 'verified', 'last_added']
    inlines = [VerseInline, ]

    def verse_set(self, db_field, request, **kwargs):
        # if db_field.name == "verse":
        #     kwargs["queryset"] = Verse.objects.filter(wanderverse=self)
        return super().verse_set(db_field, request, **kwargs)

    def total_verses(self, obj):
        return len(obj.verse_set.all())

    def verified(self, obj):
        all_verified = obj.verse_set.order_by('id').filter(verified=True)
        lv = all_verified.last()
        if lv:
            return mark_safe('last: <a href="{}">{}</a> <span>total: {}</span>'.format(
                reverse("admin:app_verse_change", args=(lv.pk,)),
                lv.pk,
                len(all_verified)

            ))

    def last_added(self, obj):
        la = obj.verse_set.order_by('id').last()
        if la:
            return mark_safe('<a href="{}">{}</a>'.format(
                reverse("admin:app_verse_change", args=(la.pk,)),
                la.pk
            ))

@admin.register(Rule)
class RuleAdmin(admin.ModelAdmin):
    list_display = ['id', 'text', 'location', 'step']

