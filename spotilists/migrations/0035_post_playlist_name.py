# Generated by Django 4.1.7 on 2023-09-05 10:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotilists', '0034_post_no_tracks_delete_playlist'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='playlist_name',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
    ]
