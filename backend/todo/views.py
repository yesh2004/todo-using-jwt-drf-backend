from django.shortcuts import render
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import exceptions
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import ensure_csrf_cookie
from .auth import generate_access_token, generate_refresh_token
from django.views.decorators.csrf import csrf_protect
import jwt
from django.conf import settings
# Create your views here.
def index(request):
	pass

@api_view(['GET'])
def user(request):
    user = request.user
    serialized_user = UserSerializer(user).data
    return Response({'user': serialized_user })

@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def login_view(request):
	User=get_user_model()
	username=request.data.get('username')
	password=request.data.get('password')
	response=Response()
	if(username is None) or (password is None):
		raise exceptions.AuthenticationFailed(
            'username and password required')
	user=User.objects.filter(username=username).first()
	if(user is None):
		raise exceptions.AuthenticationFailed('user not found')
	if(not user.check_password(password)):
		raise exceptions.AuthenticationFailed('wrong password')

	serialized_user = UserSerializer(user).data
	access_token=generate_access_token(user)
	refresh_token=generate_refresh_token(user)

	response.set_cookie(key='refreshtoken',value=refresh_token,httponly=True,secure=False, samesite=None)
	response.data={
	'access_token':access_token,
	'user':serialized_user,
	}
	return response

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_protect
def refresh_token_view(request):
	User=get_user_model()
	refresh_token=request.COOKIES.get('refreshtoken')
	if refresh_token is None:
		raise exceptions.AuthenticationFailed('Authentication credentials were not provided.')
	try:
		payload=jwt.decode(refresh_token,settings.SECRET_KEY,algorithms=['HS256'])
	except jwt.ExpiredSignatureError:
		raise exceptions.AuthenticationFailed('Refresh token expired please login again')

	user=User.objects.filter(id=payload.get('user_id')).first()
	if user is None:
		raise exceptions.AuthenticationFailed('user not found')
	if not user.is_active:
		raise exceptions.AuthenticationFailed('user not active')

	access_token=generate_access_token(user)
	return Response({'access_token':access_token})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@csrf_protect
def auth_test(request):
	print(request.user)

	return Response({'response':'working'})
