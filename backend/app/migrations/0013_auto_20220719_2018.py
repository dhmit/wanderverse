# Generated by Django 3.1.5 on 2022-07-19 20:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0012_rules_location'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rules',
            name='location',
            field=models.CharField(choices=[('a', 'default'), ('b', 'hayden'), ('c', 'elsewhere')], max_length=1),
        ),
    ]
