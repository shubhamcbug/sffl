"""
Created by Sundar on 08-10-2020.email tksrajan@gmail.com
"""
import datetime
import logging
import smtplib
from django.conf import settings

from oauth2client.service_account import ServiceAccountCredentials
from pydrive.drive import GoogleDrive
from pydrive.auth import GoogleAuth
import os
import pandas as pd
from django.db.models import Q
from events.models import Password, Event, Registration
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

LOGGER = logging.getLogger('sffl.util')

FROM = 'fflrec7680@gmail.com'


def read_users():
    filename = "/Users/tksra/downloads/REC_BATCH.xlsx"
    data = pd.read_excel(filename, names=['#', 'Branch', 'Name', 'Email ID', 'WhatsApp no', 'Mobile'])
    df = pd.DataFrame(data, columns=['Name', "Email ID"])
    list_users = []
    for index, row in df.iterrows():
        email = row['Email ID']
        if not isinstance(email, float):
            print(row['Name'], row['Email ID'])
            list_users.append((row['Name'], row['Email ID']))
    return list_users


def uploadFilesToGoogleDrive(directory):
    authorization = GoogleAuth()
    scope = ['https://www.googleapis.com/auth/drive']
    authorization.credentials = ServiceAccountCredentials.from_json_keyfile_name('client_secrets_1.json', scope)
    drive = GoogleDrive(authorization)
    for x in os.listdir(directory):
        LOGGER.debug("uploading file ", x)
        f = drive.CreateFile({str(x): x})
        f.SetContentFile(os.path.join(directory, x))
        f.Upload()
        LOGGER.debug("uploaded file ", x)
        f = None
    LOGGER.debug('Uploaded all files')


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


def createCsv(event_name):
    objects = getObjectsFromQuerySet(getRegObjects(event_name))
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

    filename = "registrations.xlsx"
    # delete the file if it exists
    root = os.getcwd()
    fullFile = root+"/"+filename
    print(fullFile)
    if os.path.exists(fullFile):
        os.remove(fullFile)
    df.to_excel(fullFile)
    return root, filename


def send_mail(to, subject, message, path, filename):
    no_reply_disclaimer = """\n\n --------------------------------------------------------------
    \n\nDO not respond to this email. All replies to this inbox are automatically trashed. 
    Contact your event administrator for any queries/discrepancies"""
    try:
        msg = MIMEMultipart()
        msg['From'] = FROM
        msg['To'] = to
        msg['Subject'] = subject
        body = message + no_reply_disclaimer
        msg.attach(MIMEText(body, 'plain'))
        filename = filename
        fqfn = path + "/" + filename  # fully qualified file name
        attachment = open(fqfn, 'rb')
        p = MIMEBase('application', 'octet-stream')
        p.set_payload(attachment.read())
        encoders.encode_base64(p)
        p.add_header('Content-Disposition', "attachment; filename= %s" % filename)
        msg.attach(p)
        s = smtplib.SMTP('smtp.gmail.com', 587)
        s.starttls()
        # Authentication
        password = Password.objects.get(pk=1)
        print(password.password)
        s.login(FROM, password.password)
        text = msg.as_string()
        s.sendmail(FROM, to, text)
        s.quit()
    except RuntimeError:
        print('Error sending email')

