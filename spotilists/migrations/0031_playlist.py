# Generated by Django 4.1.7 on 2023-08-24 19:28

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('spotilists', '0030_alter_collection_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='Playlist',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('uris', models.CharField(max_length=2000)),
                ('no_tracks', models.IntegerField(blank=True, null=True)),
                ('collection', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='spotilists.collection')),
                ('spotify_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='spotilists.spotifyuser')),
            ],
        ),
    ]
