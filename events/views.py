import json
import random
import string

from django.contrib.auth.hashers import make_password, check_password
from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from rest_framework.renderers import JSONRenderer

from .Util import *
from .forms import *
from .models import *
from .serializers import *

EXISTING = '{"status": "existing"}'
NEW = 'NEW'
INCOMPLETE = '{"status": "incomplete"}'
INVALID = '{"status":"Not a member of the group. Contact Administrator"}'
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
def change_password(request):
    if request.method == 'POST':
        form = ChangePasswordForm(request.POST)
        print('created form')
        if form.is_valid():
            print("valid")
            temp_password = form.cleaned_data['temp_password']
            new_password = form.cleaned_data['password']
            email = form.cleaned_data['email']
            content = '{"status":"success"}'
            print("email, temp_password,new_password %s %s %s" % (email, temp_password, new_password))
            try:
                if len(temp_password) == 5:
                    user = Login.objects.get(temp_password__exact=temp_password)
                    user.temp_password = ''
                    user.password = make_password(new_password)
                    user.save(update_fields=["temp_password", "password"])
                    return HttpResponse(content)
                else:
                    user = Login.objects.get(email__exact=email)
                    print("user ", str(user))
                    if check_password(new_password, user.password):
                        user.password = make_password(new_password)
                        user.save(update_fields=['password'])
                        return HttpResponse(content)
                    else:
                        return HttpResponse('{"status":"Invalid Password Change attempt"}')

            except Login.DoesNotExist:
                return HttpResponse('{"status":"User does not exist"}')
        else:
            print("errors")
            print(form.errors)


@csrf_exempt
def login(request):
    LOGGER.debug('request received for login with method as %s' % request.method)
    if request.method == 'POST':
        loginForm = LoginForm(request.POST)
        if loginForm.is_valid():
            user = loginForm.cleaned_data['username']
            password = loginForm.cleaned_data['password']
            LOGGER.debug('login attempt from user %s ' % user)
            response = user_is_valid(user, password)
            return HttpResponse(response)
        else:
            print(loginForm.errors)
    else:
        raise Http404('Invalid method GET')


def valid_registration(user, password, email, mobile):
    authorised = AuthorisedUser.objects.filter(email__exact=email)
    if len(authorised) == 0:
        return HttpResponse(INVALID)
    qs = Login.objects.filter(Q(name__exact=user) | Q(email__exact=email))
    print(qs)
    if len(qs) > 0:
        LOGGER.debug('user existing %s' % user)
        return EXISTING
    else:
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


def getRegistrations(event_name):
    qs = getRegObjects(event_name)
    serializer = RegistrationSerializer(qs, many=True)
    content = JSONRenderer().render(serializer.data)
    return content


@csrf_exempt
def registrations(request):
    LOGGER.debug('received request. Method is %s' % request.method)
    if request.method == 'POST':
        event_name = request.POST['event_name']
        LOGGER.debug('event_name = %s' % event_name)
        content = getRegistrations(event_name)
        LOGGER.debug('returning registrations => %s ' % content)
        return HttpResponse(content)


def get_admin_email(event):
    admins = event.event_admin.split(',')
    emails = []
    for admin in admins:
        try:
            adminUser = Login.objects.get(name__exact=admin)
            emails.append(adminUser.email)
        except Login.DoesNotExist:
            LOGGER.debug('The admin user is not a registered user. Admins have to be registered')
    return emails


def get_excel(event_name):
    qs = getRegObjects(event_name)
    return createCsv(getObjectsFromQuerySet(qs))


def getEmailBody(name, event_name):
    newLine = "\n\n"
    body = name + " has registered for " + event_name + newLine
    body = body + " See attachment for complete list of registrations"
    LOGGER.debug(body)
    return body


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
            LOGGER.debug('all data received')

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
                # send email to admins
                admin_user_emails = get_admin_email(event)
                for email in admin_user_emails:
                    body = getEmailBody(name, event_name)
                    path, filename = createCsv(event_name)
                    send_mail(email, 'New Registration', body, path=path, filename=filename)
                return HttpResponse('{"update":"success"}')
            except RuntimeError:
                return HttpResponse('{"update":"Registration failed. Contact Administrator"}')
        else:
            print(form.errors)
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
    global content
    if request.method == 'POST':
        LOGGER.debug("upload media request received")
        form = FileUploadForm(request.POST, request.FILES)
        if form.is_valid():
            event_name = form.cleaned_data['event_name']
            LOGGER.debug("upload media request received for event %s" % event_name)
            event = Event.objects.get(event_name__exact=event_name)
            files = request.FILES.getlist('file_url')
            LOGGER.debug('received %s files for upload ' % len(files))
            if len(files) == 0:
                content = '{"upload": "No files received for upload!"}'
                LOGGER.debug("%s" % content)
                return HttpResponse(content)
            for f in files:
                file: File_uploads = File_uploads()
                file.file_url = f
                file.event = event
                file.save()
                LOGGER.debug('Media %s saved ' % str(file.file_url))
                content = '{"upload": "success"}'
            LOGGER.debug("%s" % content)
            return HttpResponse(content)
        else:
            print(form.errors)
    else:
        return Http404('Invalid GET')


def create_new_password():
    letters = string.ascii_letters
    result_str = ''.join(random.choice(letters) for i in range(5))
    return result_str


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


@csrf_exempt
def forgot_password(request):
    if request.method == 'POST':
        form = ForgotPasswordForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            try:
                user = Login.objects.get(email__iexact=email)
                temp_password = create_new_password()
                subject = 'Password Reset'
                msg = 'Your temporary password is given below. Use it to reset your password via Change Password screen'
                body = msg + "\n\n" + temp_password
                send_mail(email, subject, body)
                user.temp_password = temp_password
                user.save(update_fields=['temp_password'])
                content = '{"status" :"success","message":"Please check your email for instructions to reset your ' \
                          'password"} '
                return HttpResponse(content)
            except Login.DoesNotExist:
                content = '{"status" :"User does not exist"}'
                return HttpResponse(content)


@csrf_exempt
def view_programs(request):
    if request.method == 'POST':
        form = ProgramForm(request.POST)
        if form.is_valid():
            event_name = form.cleaned_data['event_name']
            event = Event.objects.get(event_name__exact=event_name)
            qs = Programme.objects.filter(event_id=event.id)
            serializer = ProgramSerialzer(qs, many=True)
            content = JSONRenderer().render(serializer.data)
            return HttpResponse(content)
        else:
            print(form.errors)


@csrf_exempt
def check_event_admin(request):
    if request.method == 'POST':
        form = CheckAdminForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            event_name = form.cleaned_data['event_name']
            user = Login.objects.get(name__exact=username)
            if check_password(password, user.password):
                event = Event.objects.get(event_name__exact=event_name)
                if event.event_admin.__contains__(username):
                    content = getRegistrations(event_name)
                    return HttpResponse(content)
                else:
                    return HttpResponse('{"status:"invalid"}')
            else:
                return HttpResponse('{"status:"invalid"}')
        else:
            print(form.errors)


def populate_auth_users(request):
    list_users = read_users()
    for data in list_users:
        auth_user = AuthorisedUser()
        auth_user.name = data[0]
        auth_user.email = data[1]
        try:
            user = AuthorisedUser.objects.get(email__iexact=auth_user.email)
            user.delete()
            auth_user.save()
        except AuthorisedUser.DoesNotExist:
            auth_user.save()
    print('done...')
    return HttpResponse('{"Upload": "completed"}')
