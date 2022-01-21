from django.shortcuts import render
from django.http import JsonResponse

from app.models import Wanderverse
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
    print("getting id", random_id)
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
        'component_name': 'Random'
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
