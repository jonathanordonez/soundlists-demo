# Generated by Django 4.1.7 on 2023-03-09 00:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('spotilists', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='spotifytoken',
            old_name='session_key',
            new_name='session_id',
        ),
    ]