from django.shortcuts import render
from django.contrib.auth.models import User
from .serializers import UserSerializer,TodoSerializer
from rest_framework.views import APIView
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
from .models import Todo
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.http import Http404
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
		response=Response()
		response.data={
		"message":"not logged in"
		}
		return response
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
class todo_get(APIView):
	permission_classes=[IsAuthenticated]
	def get(self,request, format=None):
		todos=Todo.objects.filter(user=request.user)
		serializer=TodoSerializer(todos,many=True)
		return Response(serializer.data)
	def post(self,request, format=None):
		serializer=TodoSerializer(data=request.data)

		
		if serializer.is_valid():
			serializer.save(user=self.request.user)
			print(serializer.data)
			return Response(serializer.data)
		else:
			print(serializer.errors)
			return Response('Unkown Error occured')

class todo_detail(APIView):
	permission_classes=[IsAuthenticated]
	def get_object(self, pk):
		try:
			return Todo.objects.get(pk=pk)
		except Todo.DoesNotExist:
			raise Http404
	def get(self,request,pk):
		todo=self.get_object(pk)
		serializer=TodoSerializer(todo)
		return Response(serializer.data)
	def put(self,request,pk):
		todo=self.get_object(pk)
		serializer=TodoSerializer(todo,data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.error,status=status.HTTP_400_BAD_REQUEST)
	def delete(self,request,pk):
		todo=self.get_object(pk)
		todo.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
        if request.COOKIES.get('refreshtoken'):
        	cookie=request.COOKIES.get('refreshtoken')
        	response=Response()
        	response.delete_cookie('refreshtoken')
        	response.delete_cookie('sessionid')
        	response.delete_cookie('csrftoken')
        	response.data = {
            'message': 'Logged out'
        		}
        	return response
        else:
        	return Response('not logged in')
        
        