# Generated by Django 4.1.7 on 2023-04-06 02:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotilists', '0015_delete_spotifytoken'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='playlist_name',
            field=models.CharField(default=0, max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='post',
            name='playlist_songs',
            field=models.CharField(default=' ', max_length=200),
            preserve_default=False,
        ),
    ]