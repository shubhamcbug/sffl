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
urlpatterns += [path("upload", views.upload_media, name='upload'), ]
urlpatterns += [path("display", views.display_media, name='display'), ]
urlpatterns += [path("forgotPwd", views.forgot_password, name='forgotPwd'), ]
urlpatterns += [path("changePwd", views.change_password, name='changePwd'), ]
urlpatterns += [path("viewProgram", views.view_programs, name='viewProgram'), ]


