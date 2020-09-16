import os

from django.conf import settings
from django.contrib.staticfiles.urls import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path

from . import views

app_name = 'events'

urlpatterns = [path("", views.EventListView.as_view(), name='events'), ]
urlpatterns += [path("event_data", views.event_data, name='event_data'), ]
urlpatterns += [path("login", views.login, name='login'), ]
urlpatterns += [path("register", views.register, name='register'), ]
urlpatterns += [path("registrations", views.registrations, name='registrations'), ]
urlpatterns += [path("create", views.create, name='create'), ]
urlpatterns += [path("check", views.check, name='check'), ]


