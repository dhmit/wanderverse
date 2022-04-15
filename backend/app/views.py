import json
import logging
from django.shortcuts import render
from django.forms.models import model_to_dict
from django.http import JsonResponse
from app.models import Wanderverse, Verse
from app.helpers import get_random_instance
from app.validators import verse_is_valid
from app.rules import Rules

logger = logging.getLogger(__name__)


def index(request):
    """
    Home page
    """

    context = {
        'page_metadata': {
            'title': 'Home page',
            'id': 'home'
        },
        'component_name': 'Home',
        'component_props': {}
    }

    return render(request, 'index.html', context)


def about(request):
    context = {
        'page_metadata': {
            'title': 'About page',
            'id': 'about'
        },
        'component_name': 'About',
        'component_props': {}
    }
    return render(request, 'index.html', context)


def play(request):
    qs = Wanderverse.all_valid()
    w = get_random_instance(qs)
    verified_verse = w.last_verified()
    context = {
        'page_metadata': {
            'title': 'Wanderverse',
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
            'title': 'Wanderverse',
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
        w = get_random_instance(qs)

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
    w = get_random_instance(qs)

    verses = json.dumps(w.verse_objects())
    context['component_props']['data']['id'] = w.id
    context['component_props']['data']['verses'] = verses
    return render(request, 'index.html', context)


def random(request):
    qs = Wanderverse.all_valid()
    w = get_random_instance(qs)
    valid_verses = w.verse_objects_valid()
    return JsonResponse({"verses": json.dumps(valid_verses)})


def wanderverse(request, wanderverse_id=None):
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
        qs = Wanderverse.all_valid()
        w = get_random_instance(qs)
        last_verified = w.last_verified()
        return JsonResponse({"w": str(last_verified.text), "id": w.id})


def rules(request):
    rules_list = Rules().all
    return JsonResponse({'rules': rules_list})


def instructions(request):
    rules_list = Rules().all
    context = {
        'page_metadata': {
            'title': 'Wanderverse instructions',
            'id': 'instructions',
        },
        'component_props': {
            'data': {
                'rules': rules_list,
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
        Verse.objects.create(text=content['last_verse'], wanderverse=wanderverse_to_extend)

    last_verse = wanderverse_to_extend.verse_set.last()
    submitted_last_verse_text = content['last_verse']
    verse_text = content['verse'].strip()

    # Start a new Wanderverse using the verse submitted?
    start_new = "start_new" in content and (content["start_new"] == "true" or content[
        "start_new"] is True)

    # Check if text is clean:
    valid = verse_is_valid(content)
    if valid is not True:
        return JsonResponse({"valid": False, "message": valid["message"], "key": valid["key"]},
                            status=422)

    # if last_verse doesn't exist OR it exists and matches the actual last verse text
    if last_verse and last_verse.text == submitted_last_verse_text:
        verse = Verse.objects.create(text=verse_text,
                                     author=content['author'],
                                     book_title=content['book_title'],
                                     wanderverse=wanderverse_to_extend)
        if 'page_number' in content and content['page_number'].isdigit():
            verse.page_number = int(content['page_number'])
            verse.save()

    # if last verified verse is NOT the actual last verse
    # OR if no last verse or start new is True
    if not last_verse or start_new or last_verse.text != submitted_last_verse_text:
        new_wanderverse = Wanderverse.objects.create()

        # only in the case that last verified does not equal last verse:
        if last_verse.text != submitted_last_verse_text:
            # duplicate last verse, we lose author, genre, title here.
            # TODO: fix
            Verse.objects.create(text=submitted_last_verse_text,
                                 wanderverse=new_wanderverse)

        # add submitted verse
        new_verse = Verse.objects.create(text=verse_text,
                                         author=content['author'],
                                         book_title=content['book_title'],
                                         wanderverse=new_wanderverse)

        if 'page_number' in content and content['page_number'].isdigit():
            new_verse.page_number = int(content['page_number'])
            new_verse.save()

        new_verse.wanderverse = new_wanderverse
        new_verse.save()

        return JsonResponse({"success": new_verse.id}, status=200)

    return JsonResponse(content, status=200)
