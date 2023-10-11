from .models import SpotifyUser
from django.utils import timezone
from datetime import timedelta
from requests import get, post
from .credentials import BASE_URL, SPOTIFY_AUTHORIZE_URL, SPOTIFY_TOKEN_URL, CLIENT_ID, CLIENT_SECRET

BASE_URL = "https://api.spotify.com/v1/me/"


def get_user_record(session_id):
    user_record = SpotifyUser.objects.filter(session_id=session_id)
    if user_record.exists():
        return user_record[0]
    else:
        return None


def get_user_record_by_username(username):
    user_record = SpotifyUser.objects.filter(username=username)
    if user_record.exists():
        return user_record[0]
    else:
        return None


def refresh_spotify_token(session_id):
    print('session id iss: ', session_id)
    user_record = get_user_record(session_id)
    refresh_token = user_record.refresh_token
    print('this ', user_record.username)
    response = post(SPOTIFY_TOKEN_URL, data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    if (not access_token):
        return {"status": "failure"}

    token_expires_in_date = timezone.now() + timedelta(seconds=3600)

    user_record.access_token = access_token
    user_record.token_expires_in_date = token_expires_in_date
    user_record.save()

    return {"status": "success", "token": access_token, "token_expires_in_date": token_expires_in_date}


def get_spotify_user_profile(token):
    user_profile = get(BASE_URL, headers={
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer "+token
    }).json()
    return user_profile


def is_token_valid(user_record):
    if timezone.now() > user_record.token_expires_in_date:
        return False
    else:
        return True


def extract_track_ids(input_string):
    segments = input_string.split(',')
    track_ids = [segment.split(':')[2] for segment in segments]
    return ','.join(track_ids)
