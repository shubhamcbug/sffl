"""
Created by Sundar on 10-09-2020.email tksrajan@gmail.com
"""
from django import forms


class FileUploadForm(forms.Form):
    files = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))
