from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Todo
class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model=get_user_model()
		fields=['id','username','email','first_name','is_active']

class TodoSerializer(serializers.ModelSerializer):
	class Meta:
		model=Todo
		fields='__all__'
		extra_kwargs = {'user': {'required': False}}
