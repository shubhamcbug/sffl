"""
Created by Sundar on 09-10-2020.email tksrajan@gmail.com
"""
from oauth2client.service_account import ServiceAccountCredentials
from pydrive.drive import GoogleDrive
from pydrive.auth import GoogleAuth
import os

gauth = GoogleAuth()
scope = ['https://www.googleapis.com/auth/drive']
gauth.credentials = ServiceAccountCredentials.from_json_keyfile_name('client_secrets_1.json', scope)
drive = GoogleDrive(gauth)
path = r"C:\Users\tksra\Pictures\test"
print(drive)
#for x in os.listdir(path):
    # print("uploading file ", x)
    # f = drive.CreateFile({'parents': 'bangalore_meet', 'title': 'uploads', })
    # PATH_TO_FILE = os.path.join(path, x)
    # print(PATH_TO_FILE)
    # f.SetContentFile(PATH_TO_FILE)
    # f.Upload()
    # permission = f.InsertPermission({
    #     'type': 'anyone',
    #     'value': 'anyone',
    #     'role': 'reader'})
    # f = None

file_list = drive.ListFile({'q': "'root' in parents and trashed=false"}).GetList()
for file1 in file_list:
    print('title: %s, id: %s' % (file1['title'], file1['id']))
    # f = drive.CreateFile(file1)
    # f.Delete()
    print(file1['alternateLink'])

print('deleted')
