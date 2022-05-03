import json
import logging
from django.shortcuts import render
from django.forms.models import model_to_dict
from django.http import JsonResponse
from app.models import Wanderverse, Verse, Rules, Total, get_random_instance
from app.validators import verse_is_valid

logger = logging.getLogger(__name__)


def index(request):
    """
    Home page
    """

    context = {
        'page_metadata': {
            'title': 'The Wanderverse Project',
            'id': 'home'
        },
        'component_name': 'Home',
        'component_props': {}
    }

    return render(request, 'index.html', context)


def about(request):
    context = {
        'page_metadata': {
            'title': 'About Wanderverse',
            'id': 'about'
        },
        'component_name': 'About',
        'component_props': {}
    }
    return render(request, 'index.html', context)


def play(request):
    qs = Wanderverse.all_valid()
    w = get_random_instance("wanderverses", qs)
    verified_verse = w.last_verified()
    context = {
        'page_metadata': {
            'title': 'Play Wanderverse',
            'id': 'play',
        },
        'component_props': {
            'data': {
                'exquisite_verse': str(verified_verse),
                'id': w.id,
            }
        },
        'component_name': 'Play'
    }
    return render(request, 'index.html', context)


def read(request):
    params = request.GET
    context = {
        'page_metadata': {
            'title': 'Read Wanderverse',
            'id': 'read',
        },
        'component_props': {
            'data': {
                'verses': '[]',
                'id': '',
                'errors': '[]'
            }
        },
        'component_name': 'Read'
    }

    if 'id' in params:
        wanderverse_id = params.get("id")
        try:
            w = Wanderverse.objects.get(id=wanderverse_id)
        except (Wanderverse.DoesNotExist, Exception):
            context['component_props']['data']['errors'] = json.dumps(
                ["Oops, something went wrong!",
                 "The selected Wanderverse does not "
                 "exist."])
            return render(request, 'index.html', context)
    else:
        qs = Wanderverse.all_valid()
        w = get_random_instance("wanderverses", qs)

    valid_verses = w.verse_objects_valid()

    submitted = params.get("submitted")

    if submitted:
        # complicated logic to append newly added verse that has not been verified
        # verse should only appear for the reader, but not be added to the poem
        try:
            verse_to_add = Verse.objects.get(id=submitted)
        except Verse.DoesNotExist:
            context['component_props']['data']['errors'] = json.dumps(
                ["Oops, something went wrong!",
                 "The selected verse does not "
                 "exist."])
            return render(request, 'index.html', context)

        # TODO: if verse_to_add.wanderverse.id == w.id:
        submitted_verse = model_to_dict(verse_to_add, fields=['id', 'text', 'author',
                                                              'page_number', 'book_title'])
        if valid_verses[-1]['id'] < int(submitted):
            valid_verses.append(submitted_verse)
        else:
            idx = -2
            while valid_verses[idx]:
                if valid_verses[idx]['id'] < int(submitted):
                    valid_verses = valid_verses[0:valid_verses[idx]['id']] + submitted_verse + \
                                   valid_verses[idx + 1:]
                    break
                idx = idx - 1

    # TODO: what if there are no verified verses, like in a new poem?
    # TODO: send newly submitted with a param=newly_submitted (or something like it)
    # so that we can tack on the recently added verse
    context['component_props']['data']['id'] = w.id
    context['component_props']['data']['verses'] = json.dumps(valid_verses)

    return render(request, 'index.html', context)


def read_display(request):
    context = {
        'page_metadata': {
            'title': 'Wanderverse',
            'id': 'read-display',
        },
        'component_props': {
            'data': {
                'verses': '[]',
                'id': '',
                'errors': '[]'
            }
        },
        'component_name': 'ReadDisplay'
    }

    qs = Wanderverse.all_valid()
    w = get_random_instance("wanderverses", qs)

    verses = json.dumps(w.verse_objects())
    context['component_props']['data']['id'] = w.id
    context['component_props']['data']['verses'] = verses
    return render(request, 'index.html', context)


def random(request):
    qs = Wanderverse.all_valid()
    w = get_random_instance("wanderverses", qs)
    valid_verses = w.verse_objects_valid()
    return JsonResponse({"verses": json.dumps(valid_verses)})


def wanderverse(request, wanderverse_id=None, exclude=""):
    if request.POST:
        # check last line added timestamp
        # if all good, add line
        # else, create clone of object, add line
        # save obj
        return JsonResponse({})
    if wanderverse_id:
        w = Wanderverse.objects.get(id=wanderverse_id)
        exquisite = request.GET.get("exquisite", "False")
        if exquisite == "True":
            return JsonResponse({"w": str(w.exquisite())})
        else:
            return JsonResponse({"w": str(w).split("\\")})
    else:
        w = get_random_wanderverse()
        last_verified = w.last_verified()
        while last_verified.text == exclude:
            w = get_random_wanderverse()
            last_verified = w.last_verified()
        last_verified = w.last_verified()
        return JsonResponse({"w": str(last_verified.text), "id": w.id})


def get_random_wanderverse():
    qs = Wanderverse.all_valid()
    return get_random_instance("wanderverses", qs)


def rules(request):
    rules_instance = get_random_instance("rules", Rules.objects.all())
    return JsonResponse({"rules": rules_instance.list})


def instructions(request):
    rules_random = get_random_instance("rules", Rules.objects.all())
    context = {
        'page_metadata': {
            'title': 'How to play Wanderverse',
            'id': 'instructions',
        },
        'component_props': {
            'data': {
                'rules': rules_random.list,
            }
        },
        'component_name': 'Instructions'
    }
    return render(request, 'index.html', context)


def add_verse(request):
    content = json.loads(request.body)

    try:
        wanderverse_to_extend = Wanderverse.objects.get(id=content['id'])
    except Wanderverse.DoesNotExist:
        wanderverse_to_extend = Wanderverse.objects.create()

    last_verse = wanderverse_to_extend.exquisite()
    submitted_last_verse_text = content['last_verse']
    verse_text = content['verse'].strip()

    # Check if text is clean:
    valid = verse_is_valid(content)
    if valid is not True:
        return JsonResponse({"valid": False,
                             "message": valid["message"],
                             "key": valid["key"]},
                            status=422)

    # Start a new Wanderverse using the verse submitted?
    start_new = "start_new" in content and (content["start_new"] == "true" or content[
        "start_new"] is True)

    # get page number
    if 'page_number' in content and content['page_number'].isdigit():
        page_number = int(content['page_number'])
    else:
        page_number = None

    new_verse = Verse.objects.create(text=verse_text,
                                     page_number=page_number,
                                     author=content['author'],
                                     book_title=content['book_title'],
                                     genre=content['genre'])

    # if last_verse exists
    if last_verse and last_verse.text == submitted_last_verse_text:
        new_verse.wanderverse = wanderverse_to_extend
        new_verse.save()
    else:
        # do your best to find old verse.
        new_wanderverse = Wanderverse.objects.create()
        # just get the first verse that matches the last_verse text
        old_verse = Verse.objects.filter(text=submitted_last_verse_text).order_by("date").first()
        try:
            # duplicate old verse
            Verse.objects.create(text=submitted_last_verse_text,
                                 page_number=old_verse.page_number,
                                 author=old_verse.author,
                                 book_title=old_verse.book_title,
                                 genre=old_verse.genre,
                                 date=old_verse.date,
                                 wanderverse=new_wanderverse)
            new_verse.wanderverse = new_wanderverse
            new_verse.save()
        except AttributeError:
            # TODO: should never happen! Does it?
            pass

    if not last_verse or start_new:
        new_wanderverse = Wanderverse.objects.create()

        # add submitted verse
        new_verse = Verse.objects.create(text=verse_text,
                                         page_number=page_number,
                                         author=content['author'],
                                         book_title=content['book_title'],
                                         genre=content['genre'],
                                         wanderverse=new_wanderverse)

    return JsonResponse({"success": new_verse.id}, status=200)


def update_count(request):
    Total.update()
    return JsonResponse(Total.count())
