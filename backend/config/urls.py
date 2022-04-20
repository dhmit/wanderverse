from django.contrib import admin
from django.urls import path

try:
    from ..app import views
except (ImportError, ModuleNotFoundError, ValueError):
    from app import views

urlpatterns = [
    # Django admin page
    path('admin/', admin.site.urls),
    # API endpoints
    path('', views.index),
    path('about/', views.about),
    path('play/', views.play, name="play_wanderverse"),
    path('instructions/', views.instructions, name="instructions"),
    path('read/', views.read, name="read_wanderverse"),
    path('read-display/', views.read_display, name="read_wanderverse"),
    path('add-verse/', views.add_verse, name="add_verse"),
    path('wanderverses', views.wanderverse),
    path('random/', views.random, name="random"),
    path('wanderverses/<wanderverse_id>', views.wanderverse),
]
