# Generated by Django 4.1.7 on 2023-03-11 08:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotilists', '0009_alter_spotifytoken_spotify_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='spotifyuser',
            name='email_address',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]