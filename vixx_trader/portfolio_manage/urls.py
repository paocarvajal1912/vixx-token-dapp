from .                    import views
from django.urls          import include, path
from django.conf.urls     import url
from django.views.generic import TemplateView


urlpatterns = [
    path("",            views.home,      name="home"),
    path("about/",      views.about,     name="about"),
    url(r"^portfolio/", views.portfolio, name="portfolio"),
    url(r"^mypage/",    views.my_page,   name="mypage"),
]

