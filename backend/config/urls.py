from django.contrib import admin
from django.urls import path

try:
    from ..app import views
except (ImportError, ModuleNotFoundError):
    from app import views

urlpatterns = [
    # Django admin page
    path('admin/', admin.site.urls),
    # API endpoints
    path('', views.index),
    path('about/', views.about),
    path('play/', views.play),
    path('read/', views.read),
    path('add-verse/', views.add_verse),
    path('rules/', views.rules),
    path('example/', views.example),
    path('example/<example_id>', views.example),
    path('wanderverses/<wanderverse_id>', views.wanderverse),
]
