import json
import logging

from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Q
from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from rest_framework.renderers import JSONRenderer

from .forms import FileUploadForm, LoginForm, NewUserForm, EventRegistrationForm,CheckRegForm
from .models import Event, Login, Registration, File_uploads
from .serializers import EventSerializer, RegistrationSerializer, LoginSerializer

EXISTING = '{"status": "existing"}'
NEW = 'NEW'
INCOMPLETE = '{"status": "incomplete"}'
LOGGER = logging.getLogger('sffl')


class EventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


@csrf_exempt
def event_data(request):
    LOGGER.debug(request.method)
    if request.POST:
        event_name = request.POST['event_name']
        print(event_name)
        event = Event.objects.get(event_name__exact=event_name)
        serializer = EventSerializer(event)
        content = JSONRenderer().render(serializer.data)
        LOGGER.debug('sending event detail ' + content)
        return HttpResponse(content)


def user_is_valid(user, password):
    try:
        user = Login.objects.get(name__exact=user)
        valid = check_password(password, user.password)
        if valid:
            LOGGER.debug('{"user": "valid","password":"valid"}')
            return '{"user": "valid","password":"valid"}'
        else:
            LOGGER.debug('{"user": "valid","password":"invalid"}')
            return '{"user": "valid","password":"invalid"}'
    except Login.DoesNotExist:
        LOGGER.debug('user not found')
        return '{"user": "invalid"}'


@csrf_exempt
def login(request):
    LOGGER.debug('request received for login with method as %s' % request.method)
    if request.method == 'POST':
        loginForm = LoginForm(request.POST)
        if loginForm.is_valid():
            user = loginForm.cleaned_data['username']
            password = loginForm.cleaned_data['password']
            LOGGER.debug('login attempt with user %s and password %s' % (user, make_password(password)))
            response = user_is_valid(user, password)
            return HttpResponse(response)
        else:
            print(loginForm.errors)
    else:
        raise Http404('Invalid method GET')


def valid_registration(user, password, email, mobile):
    try:
        user = Login.objects.get(name__exact=user)
        LOGGER.debug('user existing %s' % user)
        return EXISTING
    except Login.DoesNotExist:
        LOGGER.debug('User does not exist. New User')
        if user and password and email and mobile:
            return NEW
        else:
            return INCOMPLETE


@csrf_exempt
def register(request):
    if request.method == 'POST':
        form = NewUserForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data['username']
            password = form.cleaned_data['password']
            email = form.cleaned_data['email']
            mobile = form.cleaned_data['mobile']
            LOGGER.debug('post values %s %s %s' % (user, email, mobile))
            # save
            status = valid_registration(user, password, email, mobile)
            LOGGER.debug('Status is %s' % status)
            if status == NEW:
                LOGGER.debug('Creating new user ')
                login_ = Login()
                login_.name = user
                login_.password = make_password(password)
                login_.email = email
                login_.mobile = mobile
                login_.temp_password = ''
                login_.save()
                user = Login.objects.get(name__exact=user)
                serializer = LoginSerializer(user)
                content = JSONRenderer().render(serializer.data)
                LOGGER.debug('response to new user registration is %s' % content)
                return HttpResponse(content)
            elif status == EXISTING:
                LOGGER.debug('status existing ')
                return HttpResponse(EXISTING)
            else:
                LOGGER.debug('status incomplete')
                return HttpResponse(INCOMPLETE)
        else:
            print(form.errors)


@csrf_exempt
def registrations(request):
    LOGGER.debug('received request. Method is %s' % request.method)
    if request.method == 'POST':
        event_name = request.POST['event_name']
        LOGGER.debug('event_name = %s' % event_name)
        event = Event.objects.get(event_name__exact=event_name)
        print(event)
        qs = Registration.objects.filter(Q(event_id=event.id), Q(is_deleted='No'))
        serializer = RegistrationSerializer(qs, many=True)
        content = JSONRenderer().render(serializer.data)
        LOGGER.debug('returning registrations => %s ' % content)
        return HttpResponse(content)


@csrf_exempt
def create(request):
    if request.method == 'POST':
        form = EventRegistrationForm(request.POST)
        if form.is_valid():
            # retrieve parameters
            event_name = form.cleaned_data['event_name']
            event = Event.objects.get(event_name__exact=event_name)
            name = form.cleaned_data['name']
            payment_amount = form.cleaned_data['payment_amount']
            payment_ref = form.cleaned_data['payment_ref']
            num_guests = form.cleaned_data['num_guests']
            num_days = form.cleaned_data['num_days']
            mode_of_travel = form.cleaned_data['mode_of_travel']
            arrival_date = form.cleaned_data['arrival_date']
            arrival_time = form.cleaned_data['arrival_time']
            departure_date = form.cleaned_data['departure_date']
            pickup = form.cleaned_data['pickup']
            # create the object
            registration = Registration()
            registration.event = event
            registration.name = name
            registration.payment_amount = payment_amount
            registration.payment_ref = payment_ref
            registration.num_guests = num_guests
            registration.num_days = num_days
            registration.mode_of_travel = mode_of_travel
            registration.arrival_date = arrival_date
            registration.arrival_time = arrival_time
            registration.departure_date = departure_date
            registration.pickup = pickup
            # save to database
            try:
                registration.save()
                LOGGER.debug('Registration successful')
                return HttpResponse('{"update":"success"}')
            except RuntimeError:
                return HttpResponse('{"update":"Registration failed. Contact Administrator"}')
    else:
        raise Http404('Invalid method GET')


@csrf_exempt
def check(request):
    if request.method == 'POST':
        form = CheckRegForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            event_name = form.cleaned_data['event_name']
            LOGGER.debug('received check for %s and event %s' % (name, event_name))
            event = Event.objects.get(event_name__exact=event_name)
            try:
                registration = Registration.objects.get(Q(event_id=event.id), Q(name__exact=name), Q(is_deleted='No'))
                serializer = RegistrationSerializer(registration)
                content = JSONRenderer().render(serializer.data)
                LOGGER.debug('User found. returning response %s' % content)
                return HttpResponse(content)
            except Registration.DoesNotExist:
                res = '{"user":"false"}'
                LOGGER.debug('user not found. Returning response %s' % res)
                return HttpResponse(res)
    if request.method == 'GET':
        raise Http404('invalid GET')


@csrf_exempt
def upload_media(request):
    if request.method == 'POST':
        LOGGER.debug("upload media request received")
        event_name = request.POST['event_name']
        LOGGER.debug("upload media request received for event %s" % event_name)
        event = Event.objects.get(event_name__exact=event_name)
        FileUploadForm(request.POST, request.FILES)
        files = request.FILES.getlist('file_url')
        for f in files:
            file: File_uploads = File_uploads()
            file.file_url = f
            file.event = event
            file.save()
            LOGGER.debug('Media %s saved ' % str(file.file_url))
        content = '{"upload: "success"}'
        LOGGER.debug("%s" % content)
        return HttpResponse(content)


@csrf_exempt
def display_media(request):
    if request.method == 'POST':
        event_name = request.POST['event_name']
        event = Event.objects.get(event_name__exact=event_name)
        media = File_uploads.objects.filter(event_id=event.id)
        url_prefix = settings.MEDIA_URL
        urls = []
        for m in media:
            urls.append(url_prefix + str(m.file_url))
        print(urls)
        content = json.dumps(urls)
        LOGGER.debug(content)
        return HttpResponse(content)
