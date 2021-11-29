from .           import views
from django.urls import include, path
from django.views.generic import TemplateView


urlpatterns = [
    path("",           views.home,      name="home"),
    path("about/",     views.about,     name="about"),
    path("portfolio/", views.portfolio, name="portfolio"),
]

