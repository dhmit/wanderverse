# Generated by Django 3.1.5 on 2022-07-21 01:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0016_auto_20220721_0123'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='total',
            name='rules_a',
        ),
        migrations.RemoveField(
            model_name='total',
            name='rules_b',
        ),
        migrations.RemoveField(
            model_name='total',
            name='rules_c',
        ),
        migrations.RemoveField(
            model_name='total',
            name='rules_d',
        ),
        migrations.AddField(
            model_name='total',
            name='rules',
            field=models.JSONField(default={}),
        ),
    ]
