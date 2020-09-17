"""
Created by Sundar on 09-09-2020.email tksrajan@gmail.com
"""


from rest_framework import serializers



class EventSerializer(serializers.Serializer):
    event_name = serializers.CharField(max_length=25)
    event_venue = serializers.CharField(max_length=25)
    event_date = serializers.DateField(default=None)
    event_time = serializers.TimeField(default=None)
    event_description = serializers.CharField(max_length=100)
    event_admin = serializers.CharField(max_length=50)
    event_link = serializers.URLField()


class RegistrationSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=40)
    payment_amount = serializers.CharField(max_length=5)
    payment_ref = serializers.CharField(max_length=10)
    num_guests = serializers.IntegerField(default=1)
    num_days = serializers.IntegerField(default=2)
    mode_of_travel = serializers.CharField(max_length=5)
    arrival_date = serializers.DateField(default=None)
    arrival_time = serializers.TimeField(default=None)
    departure_date = serializers.DateField(default=None)
    pickup = serializers.CharField(max_length=5)


class LoginSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=10)
    email = serializers.CharField(max_length=15)
    mobile = serializers.CharField(max_length=15)
