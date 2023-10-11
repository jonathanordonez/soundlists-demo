from decouple import config

BASE_URL = "https://api.spotify.com/v1/me/"
SPOTIFY_AUTHORIZE_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
CLIENT_ID = "98c1ee9d62ba4e158910ba3ae9edad36"
REDIRECT_URI = f'{config("DJANGO_SERVER")}/api/spotify-callback'
CLIENT_SECRET = '06b4f313831541159da44c10a2100090'
