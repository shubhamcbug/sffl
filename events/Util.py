"""
Created by Sundar on 08-10-2020.email tksrajan@gmail.com
"""
import logging
import smtplib
from django.conf import settings
from timeit import default_timer as timer

import pandas as pd
from django.db.models import Q

from events.models import Password, Event, Registration

LOGGER = logging.getLogger('sffl.util')
xlUrl = "http://" + settings.HOST + ":8000/"


def getRegObjects(event_name):
    event = Event.objects.get(event_name__exact=event_name)
    print(event)
    qs = Registration.objects.filter(Q(event_id=event.id), Q(is_deleted='No'))
    return qs


def getObjectsFromQuerySet(qs):
    objects = []
    for item in qs:
        objects.append(item)

    return objects


def createCsv(objects):
    dfSource = []
    columns = ["name", "payment", "payment_ref", "Guests", "Days", "Arrival", "Time", "Departure", "Travel Mode",
               "Pickup"]
    dfSource.append(columns)
    for obj in objects:
        values = [obj.name, obj.payment_amount, obj.payment_ref, obj.num_guests, obj.num_days,
                  obj.arrival_date, obj.arrival_time, obj.departure_date, obj.mode_of_travel, obj.pickup]
        dfSource.append(values)

    df = pd.DataFrame(dfSource)
    print(df)
    timestamp = timer()
    filename = "staticfiles/registrations_"+str(timestamp)+".xlsx"
    df.to_excel(filename)
    return xlUrl+filename


def send_mail(receiver, subject, body):
    LOGGER.debug('sending email to event admin %s ' % receiver)
    smtp_server = smtplib.SMTP("smtp.gmail.com", 587)
    sender = 'fflrec7680'
    try:
        password = Password.objects.get(pk=1)
        print('sender is %s amd  password is %s' % (sender, password.password))
        smtp_server.ehlo()
        smtp_server.starttls()
        smtp_server.login(sender, password.password)
        msg = 'Subject: {}\n\n{}'.format(subject, body)
        smtp_server.sendmail(sender, receiver, msg)
        print('Mail sent')
        smtp_server.close()
    except RuntimeError:
        LOGGER.warning("Email could not be sent %s" % str(RuntimeError))
