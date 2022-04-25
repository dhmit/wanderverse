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
    path('rules/', views.rules, name="rules"),
    path('wanderverses/<int:wanderverse_id>', views.wanderverse),
    path('wanderverses/<str:exclude>', views.wanderverse, name="wanderverse_exclude"),
    path('wanderverses', views.wanderverse, name="wanderverse_random"),
    path('random/', views.random, name="random"),
    path('count/', views.update_count, name="count"),
]
