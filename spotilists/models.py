from django.db import models
from django.utils import timezone
import uuid


class SpotifyUser(models.Model):
    username = models.CharField(max_length=10, unique=True)
    spotify_user_id = models.CharField(max_length=50, unique=True)
    spotify_display_name = models.CharField(max_length=50)
    email_address = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    session_id = models.CharField(max_length=50, default='0')
    access_token = models.CharField(max_length=150, null=True, blank=True)
    refresh_token = models.CharField(max_length=150, null=True, blank=True)
    token_expires_in_date = models.DateTimeField(default=timezone.now)
    profile_pic = models.CharField(
        max_length=100, default='default-profile-pic.jpg')


class Collection(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, blank=False)
    spotify_user = models.ForeignKey(
        SpotifyUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    # To anaylize: Should this eventually save playlist IDs, and not the Spotify playlist IDs?
    playlist_ids = models.CharField(max_length=50, null=True, blank=True)
    description = models.CharField(max_length=100, null=True, blank=True)
    tags = models.CharField(max_length=50, null=True, blank=True)
    no_playlists = models.IntegerField(null=True, blank=True)
    no_tracks = models.IntegerField(null=True, blank=True)


class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    spotify_user = models.ForeignKey(
        SpotifyUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    collection = models.ForeignKey(
        Collection, on_delete=models.CASCADE)
    playlist_id = models.CharField(max_length=50)
    playlist_name = models.CharField(max_length=50)
    uris = models.CharField(max_length=2000)
    track_uris = models.CharField(max_length=6000)
    uris_no_available_markets = models.CharField(max_length=2000)
    track_uris_no_available_markets = models.CharField(max_length=6000)
    no_tracks = models.IntegerField(null=True, blank=True)
