from django.http import JsonResponse
from spotilists import utils
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
import datetime
import json
from .models import SpotifyUser, Post, Collection
import boto3


@csrf_exempt
def fetch_token(request):
    # user_record = utils.get_user_record(session_key)

    user_record = SpotifyUser.objects.get(username='Niko')
    session_key = user_record.session_id

    if user_record:
        spotify_user_id = user_record.spotify_user_id
        expiry = user_record.token_expires_in_date
        expires_in_timestamp = datetime.datetime.timestamp(expiry)
        username = user_record.username
        profile_picture = user_record.profile_pic

        if expiry <= timezone.now():
            token_values = utils.refresh_spotify_token(
                session_key)
            print('token values is ', token_values)
            if (token_values['status'] == "failure"):
                response = JsonResponse({"authenticated": "failure"})
                response["Access-Control-Allow-Credentials"] = 'true'
                return response
            response = JsonResponse(
                {"authenticated": True, "token": token_values['token'], "expiresInTimestamp": expires_in_timestamp * 1000,
                 "spotifyUserId": spotify_user_id})
            response["Access-Control-Allow-Credentials"] = 'true'
            return response
        response = JsonResponse(
            {"authenticated": True, "token": user_record.access_token, "expiresInTimestamp": expires_in_timestamp * 1000,
             "spotifyUserId": spotify_user_id, "username": username, "profilePicture": profile_picture})
        response["Access-Control-Allow-Credentials"] = 'true'
        return response

    response = JsonResponse({"authenticated": False})
    response["Access-Control-Allow-Credentials"] = 'true'
    return response


@csrf_exempt
def share_playlist(request):
    print(request.body)

    # # Obtain uris without "spotify:track:" i.e., '5LciLoxa1gK70yIUeoHgRx,7IJkIQZCy0a6gowQBhGuCJ'
    # utils.extract_track_ids(track_uris)

    try:
        data = json.loads((request.body.decode('ascii')))
        # collection_id = data['collectionId']
        playlist_id = data['playlistId']
        playlist_name = data['playlistName']
        track_uris = data['trackUris']
        uris = data['uris']
        track_uris_no_available_markets = data['trackUrisNoAvailableMarkets']
        uris_no_available_markets = data['urisNoAvailableMarkets']
        # spotify_user = utils.get_user_record(request.session.session_key)
        spotify_user = SpotifyUser.objects.get(username='Niko')
        collection_id = Collection.objects.get(
            spotify_user_id=spotify_user.id).id
        Post.objects.create(spotify_user=spotify_user, collection_id=collection_id,
                            playlist_id=playlist_id, playlist_name=playlist_name, track_uris=track_uris, uris=uris, track_uris_no_available_markets=track_uris_no_available_markets,
                            uris_no_available_markets=uris_no_available_markets)

        response = JsonResponse(
            {"Status": "Successful", "Details": f"Post added with playlist: {playlist_id}"})
    except:
        response = JsonResponse(
            {"Status": "Failure", "Details": f"Unable to add playlist: {playlist_id}"})

    response["Access-Control-Allow-Credentials"] = 'true'

    return response


@csrf_exempt
def get_posts(request):
    posts_with_username = []
    data = json.loads((request.body.decode('ascii')))
    # print(data)
    filter_username = data['searchUsername']
    filter_tag = data['searchTag']
    batch_number = data['postsBatchNo']

    print('this ', filter_username, filter_tag, batch_number)

    end_record_no = batch_number * 5
    start_record_no = end_record_no - 5

    if (filter_tag):
        posts = Post.objects.filter(
            playlist_tags__icontains=filter_tag).order_by('-created_at')
    else:
        posts = Post.objects.all().order_by(
            '-created_at')

    if (filter_username):
        posts = posts.filter(spotify_user__username=filter_username)[
            start_record_no:end_record_no]

    else:
        posts = posts[start_record_no:end_record_no]

    for post in posts:
        posts_with_username.append({"id": post.id, "username": post.spotify_user.username, "profile_picture": post.spotify_user.profile_pic, "playlist_id": post.playlist_id,
                                    "playlist_name": post.playlist_name, "created_at": post.created_at,
                                   "uris": post.uris, "track_uris": post.track_uris, "collectionId": post.collection_id, "collectionName": post.collection.name})

    response = JsonResponse({"posts": posts_with_username})

    response["Access-Control-Allow-Credentials"] = 'true'
    response["posts_batch_no"] = batch_number
    return response


# @ csrf_exempt
# def fetch_playlists_songs(spotify_user_id, token, playlist_id):
#     url = f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks'
#     headers = {'Authorization': f'Bearer {token}'}
#     request = requests.get(url, headers=headers)
#     json = request.json()
#     return json


def user_details(request):

    try:
        # user_record = utils.get_user_record(request.session.session_key)
        user_record = SpotifyUser.objects.get(username='Niko')
        username = user_record.username
        profile_picture = user_record.profile_pic
        spotifyUserId = user_record.spotify_user_id
        if (username and profile_picture):
            has_data = True
        else:
            has_data = False
        response = JsonResponse(
            {"status": "successful", "has_data": has_data, "username": username, "profile_picture": profile_picture, "spotifyUserId": spotifyUserId})
    except Exception as e:
        print(e)
        response = JsonResponse({"status": "failure"})
    response["Access-Control-Allow-Credentials"] = 'true'
    return response


@ csrf_exempt
def delete_post(request):
    user_record = SpotifyUser.objects.get(username='Niko')
    user_record_id = user_record.id
    # user_record_id = utils.get_user_record(request.session.session_key).id
    print(json.loads((request.body.decode('ascii'))))
    try:
        data = json.loads((request.body.decode('ascii')))
        post_id = data['postId']
        print(post_id)
        post = Post.objects.get(id=post_id)
        if (user_record_id == post.spotify_user.id):
            post.delete()
            response = JsonResponse({"status": "successful"})
        else:
            response = JsonResponse({"status": "forbidden"})
    except:
        response = JsonResponse({"status": "failure"})

    response["Access-Control-Allow-Credentials"] = 'true'
    return response


@ csrf_exempt
def upload_profile_picture(request):
    try:
        file_name_extension = request.FILES["file"].name.split('.')[-1:][0]
        user_record = SpotifyUser.objects.get(username='Niko')
        # user_record = utils.get_user_record(request.session.session_key)
        upload_file_name = f'{user_record.spotify_user_id}-{datetime.datetime.now().timestamp()}.{file_name_extension}'

        # Send file to S3
        s3 = boto3.resource('s3')
        file = request.FILES["file"].read()
        s3.Bucket(
            'soundlists-profpics').put_object(Key=upload_file_name, Body=file)

        # Upload file name in DB
        user_record.profile_pic = upload_file_name
        user_record.save()

        response = JsonResponse(
            {"status": "successful", "upload_file_name": upload_file_name})

    except:
        response = JsonResponse({"status": "failure"})

    response["Access-Control-Allow-Credentials"] = 'true'
    return response
