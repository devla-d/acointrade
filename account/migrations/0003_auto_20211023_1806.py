# Generated by Django 3.2.8 on 2021-10-23 17:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_auto_20211023_1802'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='uri',
            field=models.CharField(blank=True, default='697F27FFDC', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='account',
            name='wallet_id',
            field=models.CharField(default='F8770B9B32', max_length=50, unique=True),
        ),
    ]