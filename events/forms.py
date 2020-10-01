"""
Created by Sundar on 10-09-2020.email tksrajan@gmail.com
"""
from django import forms


class FileUploadForm(forms.Form):
    event_name = forms.CharField(max_length=50)
    file_url = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))


class LoginForm(forms.Form):
    username = forms.CharField(max_length=20)
    password = forms.CharField(max_length=20)


class NewUserForm(forms.Form):
    username = forms.CharField(max_length=20)
    password = forms.CharField(max_length=20)
    email = forms.CharField(max_length=20)
    mobile = forms.CharField(max_length=15)


class EventRegistrationForm(forms.Form):
    event_name = forms.CharField(max_length=50)
    name = forms.CharField(max_length=40)
    payment_amount = forms.CharField(max_length=5)
    payment_ref = forms.CharField(max_length=10)
    num_guests = forms.IntegerField()
    num_days = forms.IntegerField()
    mode_of_travel = forms.CharField(max_length=5)
    arrival_date = forms.DateField()
    arrival_time = forms.TimeField()
    departure_date = forms.DateField()
    pickup = forms.CharField(max_length=5)


class CheckRegForm(forms.Form):
    name = forms.CharField(max_length=20)
    event_name = forms.CharField(max_length=50)
