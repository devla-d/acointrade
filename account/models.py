from django.db import models
from django.contrib.auth.models import AbstractUser
from django.urls import reverse
from django.conf import settings
#from django.utils.crypto import get_random_string

import random
import json
import string
from uuid import uuid4

 
from .validators import ASCIIUsernameValidator

def rand_str(size):
    code = str(uuid4()).replace('-', '')[:size]
    code_upper = code.upper()
    return code_upper




class Account(AbstractUser):
    username = models.CharField(max_length = 50, blank = True, null = True, unique = True)
    email       = models.EmailField(verbose_name='email', max_length=60, unique=True )
    postalcode    = models.CharField(max_length=30,blank=True,null=True)
    fullname    = models.CharField(max_length=100,blank=True,null=True)
    country    = models.CharField(max_length=100,blank=True,null=True)
    address    = models.CharField(max_length=100,blank=True,null=True)
    currency    = models.CharField(max_length=100,blank=True,null=True)
    date_of_birth = models.DateTimeField(blank=True,null=True)
    #profile_image = models.ImageField(blank=True, null=True, default='defualt.png', upload_to='uploads')
    phone = models.CharField(max_length=30, blank=True,null=True,unique=True)
    balance = models.IntegerField(default=0, blank=True,null=True)
    withdraw_total = models.IntegerField(default=0, blank=True,null=True) 
    uri = models.CharField(max_length=50, default=rand_str(10), blank=True,null=True)
    wallet_id = models.CharField(max_length=50, default=rand_str(10), unique=True)
    is_email_verifield = models.BooleanField(default=False)
 
    username_validator = ASCIIUsernameValidator()


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    


    def __str__(self):
        return self.username







