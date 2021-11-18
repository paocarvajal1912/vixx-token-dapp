from .           import views
from django.urls import path
from django.views.generic import TemplateView


urlpatterns = [
    # path("",        views.home,        name="home"),
    path("signup/", views.signup_view, name="signup"),
    path("login/",  views.login_view,  name="login"),
    path('hello-webpack/', TemplateView.as_view(template_name='hello_webpack.html')),
]

