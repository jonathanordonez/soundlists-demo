# Generated by Django 4.1.7 on 2023-03-29 04:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('spotilists', '0011_rename_username_spotifyuser_display_name_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('playlist_id', models.CharField(max_length=50)),
                ('comments', models.CharField(max_length=100)),
                ('spotify_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='spotilists.spotifyuser')),
            ],
        ),
    ]
