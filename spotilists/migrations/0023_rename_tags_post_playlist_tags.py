# Generated by Django 4.1.7 on 2023-05-24 03:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('spotilists', '0022_post_tags_alter_spotifyuser_profile_pic'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='tags',
            new_name='playlist_tags',
        ),
    ]
