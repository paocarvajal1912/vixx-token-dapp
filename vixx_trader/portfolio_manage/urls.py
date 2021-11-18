from .           import views
from django.urls import include, path
from django.views.generic import TemplateView


urlpatterns = [
    path("",        views.home,        name="home"),
    path("signup/", views.signup_view, name="signup"),
    path("login/",  views.login_view,  name="login"),
]

