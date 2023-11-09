from django.urls import path
from spotilists import views
from django.views.generic import TemplateView

urlpatterns = [
    path('fetch_token', views.fetch_token),
    path('share_playlist', views.share_playlist),
    path('user_details', views.user_details),
    path('get_posts', views.get_posts),
    path('delete_post', views.delete_post),
    path('upload_profile_picture', views.upload_profile_picture),
]
