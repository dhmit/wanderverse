import json
from django.shortcuts import render
from django.http import JsonResponse
from app.models import Wanderverse, Verse
from app.helpers import get_random_instance
from app.validators import verse_is_valid
from app.rules import Rules


def index(request):
    """
    Home page
    """

    context = {
        'page_metadata': {
            'title': 'Home page',
            'id': 'home'
        },
        'component_name': 'Home'
    }

    return render(request, 'index.html', context)


def about(request):
    context = {
        'page_metadata': {
            'title': 'About page',
            'id': 'about'
        },
        'component_name': 'About'
    }
    return render(request, 'index.html', context)


def instructions(request):
    new_rules = Rules().all
    context = {
        'page_metadata': {
            'title': 'Instructions page',
            'id': 'instructions',
        },
        'component_props': {
            'rules': new_rules
        },
        'component_name': 'Instructions'
    }
    return render(request, 'index.html', context)


def example(request, example_id=None):
    """
    Example page
    """

    context = {
        'page_metadata': {
            'title': 'Example ID page'
        },
        'component_props': {
            'id': example_id
        },
        'component_name': 'ExampleId'
    }
    return render(request, 'index.html', context)


def play(request):
    qs = Wanderverse.objects.all()
    w = get_random_instance(qs)
    context = {
        'page_metadata': {
            'title': 'Wanderverse',
            'id': 'play',
        },
        'component_props': {
            'data': {
                'exquisite_verse': str(w.exquisite()),
                'id': w.id,
            }
        },
        'component_name': 'Play'
    }
    return render(request, 'index.html', context)


def read(request):
    params = request.GET
    if "id" in params:
        wanderverse_id = params.get("id")
        w = Wanderverse.objects.get(id=wanderverse_id)
    else:
        qs = Wanderverse.objects.all()
        w = get_random_instance(qs)
    verses = json.dumps(w.verse_objects())

    context = {
        'page_metadata': {
            'title': 'Wanderverse',
            'id': 'read',
        },
        'component_props': {
            'data': {
                'verses': verses,
                'id': w.id,
            }
        },
        'component_name': 'Read'
    }
    return render(request, 'index.html', context)


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
        qs = Wanderverse.objects.all()
        w = get_random_instance(qs)
        return JsonResponse({"w": str(w.exquisite())})


def rules(request):
    rules_list = Rules().all
    return JsonResponse({'rules': rules_list})


def add_verse(request):
    content = json.loads(request.body)

    try:
        wanderverse_to_extend = Wanderverse.objects.get(id=content['id'])
    except Wanderverse.DoesNotExist:
        wanderverse_to_extend = Wanderverse.objects.create()
        Verse.objects.create(text=content['last_verse'], wanderverse=wanderverse_to_extend)

    last_verse = wanderverse_to_extend.verse_set.last()
    last_verse_text = content['last_verse']
    verse_text = content['verse'].strip()

    # Check if text is clean:
    if not verse_is_valid(content):
        return JsonResponse({"valid": False, "message": "Not allowed"}, status=422)

    # if last_verse doesn't exist OR it exists and matches the actual last verse text
    if last_verse and last_verse.text == last_verse_text:
        verse = Verse.objects.create(text=verse_text,
                                     author=content['author'],
                                     book_title=content['book_title'],
                                     wanderverse=wanderverse_to_extend)
        if 'page_number' in content and content['page_number'].isdigit():
            verse.page_number = int(content['page_number'])
            verse.save()

    # if no last verse or start new is ticked true
    if not last_verse or ('start_new' in content and content['start_new'] == "true") or \
        last_verse.text != last_verse_text:
        new_wanderverse = Wanderverse.objects.create()
        new_verse = Verse.objects.create(text=verse_text,
                                         author=content['author'],
                                         book_title=content['book_title'],
                                         wanderverse=new_wanderverse)
        if 'page_number' in content and content['page_number'].isdigit():
            new_verse.page_number = int(content['page_number'])
            new_verse.save()

        new_verse.wanderverse = new_wanderverse
        new_verse.save()

    return JsonResponse(content, status=200)
