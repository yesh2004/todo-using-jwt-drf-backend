from django.urls import path
from . import views
urlpatterns = [
    path('',views.index),
    path('user',views.user,name='user'),
    path('login/',views.login_view,name='login_view'),
    path('refresh/',views.refresh_token_view,name='refresh_token_view'),
    path('auth_test/',views.auth_test)
]
