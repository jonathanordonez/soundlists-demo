# Generated by Django 4.1.7 on 2023-03-12 02:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('spotilists', '0010_spotifyuser_email_address'),
    ]

    operations = [
        migrations.RenameField(
            model_name='spotifyuser',
            old_name='username',
            new_name='display_name',
        ),
        migrations.RenameField(
            model_name='spotifyuser',
            old_name='uri',
            new_name='spotify_user_id',
        ),
    ]
