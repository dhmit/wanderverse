# Generated by Django 3.1.5 on 2022-07-19 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_auto_20220427_0322'),
    ]

    operations = [
        migrations.AddField(
            model_name='rules',
            name='location',
            field=models.CharField(choices=[('a', 'default'), ('b', 'hayden:1st_floor'), ('b', 'hayden:stacks'), ('c', 'elsewhere')], default='a', max_length=1),
            preserve_default=False,
        ),
    ]
