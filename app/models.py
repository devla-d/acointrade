from django.db import models
import random
import json
from uuid import uuid4



from account.models import Account






class Transaction(models.Model):
    user = models.ForeignKey(Account,related_name='trans_usr', on_delete=models.CASCADE)
    transac_type = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    coin = models.CharField(max_length=100,blank=True ,null=True)
    amount = models.FloatField(default=0)
    pop = models.CharField(max_length=100,blank=True ,null=True)
    date = models.DateTimeField( auto_now_add=True,blank=True,null=True)

    def __str__(self):
        return self.status


class POP(models.Model):
    transaction = models.ForeignKey(Transaction,related_name='trans_pop', on_delete=models.CASCADE)
    pop = models.CharField(max_length=100,blank=True ,null=True)
    status = models.CharField(max_length=100)
    amount = models.IntegerField(default=0)
    date = models.DateTimeField( auto_now_add=True,blank=True,null=True)

    def __str__(self):
        return self.status