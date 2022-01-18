from django.shortcuts import render

from app.models import Wanderverse
from app.helpers import get_random_obj
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


def random_wanderverse(request):
    qs = Wanderverse.objects.all()
    random_w = get_random_obj(qs)
    context = {
        'page_metadata': {
            'title': 'Instructions page',
            'id': 'instructions',
        },
        'component_props': {
            'data': str(random_w).split("\\")
        },
        'component_name': 'Random'
    }
    print(context)

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
