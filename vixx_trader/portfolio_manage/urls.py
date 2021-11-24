from .           import views
from django.urls import include, path
from django.views.generic import TemplateView


urlpatterns = [
    path("",        views.home,        name="home"),
    path("about/",  views.about,       name="about"),
    path("signup/", views.signup_view, name="signup"),
    path("login/",  views.login_view,  name="login"),

    # path("transaction/create/", views.transaction_create_view, name="transactioncreate"),
    # path("transaction",       views.transaction_execute,       name="transactionexecute"),

]

