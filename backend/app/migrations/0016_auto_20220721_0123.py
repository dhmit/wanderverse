# Generated by Django 3.1.5 on 2022-07-21 01:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0015_rules_location'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='total',
            name='rules',
        ),
        migrations.AddField(
            model_name='total',
            name='rules_a',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='total',
            name='rules_b',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='total',
            name='rules_c',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='total',
            name='rules_d',
            field=models.IntegerField(default=0),
        ),
    ]