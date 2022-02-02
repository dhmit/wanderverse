import json
from django.urls import reverse
from django.shortcuts import render, redirect
from django.http import JsonResponse
from app.models import Wanderverse, Verse
from app.helpers import get_random_id
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
    random_id = get_random_id(qs)
    w = Wanderverse.objects.get(id=random_id)
    context = {
        'page_metadata': {
            'title': 'Wanderverse',
            'id': 'play',
        },
        'component_props': {
            'data': {
                'exquisite_verse': str(w.exquisite()),
                'id': random_id,
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
        wanderverse_id = get_random_id(qs)
        w = Wanderverse.objects.get(id=wanderverse_id)
    verses = json.dumps(w.verse_objects())

    context = {
        'page_metadata': {
            'title': 'Wanderverse',
            'id': 'read',
        },
        'component_props': {
            'data': {
                'verses': verses,
                'id': wanderverse_id,
            }
        },
        'component_name': 'Read'
    }
    return render(request, 'index.html', context)


def wanderverse(request, wanderverse_id=None, exquisite=False):
    if request.POST:
        # check last line added timestamp
        # if all good, add line
        # else, create clone of object, add line
        # save obj
        pass
    if wanderverse_id:
        w = Wanderverse.objects.get(id=wanderverse_id)
        exquisite = request.GET.get("exquisite", "False")
        if exquisite == "True":
            return JsonResponse({"w": str(w.exquisite())})
        else:
            return JsonResponse({"w": str(w).split("\\")})


def rules(request):
    rules_list = Rules().all
    return JsonResponse({'rules': rules_list})


def add_verse(request):
    content = json.loads(request.body)
    print("add_verse content:", content)
    wanderverse_to_extend = Wanderverse.objects.get(id=content['id'])
    last_verse = wanderverse_to_extend.verse_set.last()
    last_verse_text = content['last_verse']
    # TODO: add some validations
    if last_verse.text == last_verse_text:
        # TODO: check for date conflicts
        # TODO: check if clean, return error if not
        verse = Verse.objects.create(text=content['verse'].strip(),
                                     author=content['author'],
                                     book_title=content['book_title'],
                                     wanderverse=wanderverse_to_extend)
        try:
            if 'page_number' in content:
                verse.page_number = int(content['page_number'])
                verse.save()
        except:
            pass
    if (content['start_new'] and content['start_new'] == "true") or last_verse.text != \
        last_verse_text:
        new_wanderverse = Wanderverse.objects.create()
        new_verse = Verse.objects.create(text=content['verse'].strip(),
                                         author=content['author'],
                                         book_title=content['book_title'],
                                         wanderverse=new_wanderverse)
        try:
            if 'page_number' in content:
                new_verse.page_number = int(content['page_number'])
                new_verse.save()
        except:
            pass

        new_verse.wanderverse = new_wanderverse
        new_verse.save()

    # return redirect(reverse("read_wanderverse"), wanderverse_id=wanderverse_to_extend.id)
    return JsonResponse(content, status=200)
