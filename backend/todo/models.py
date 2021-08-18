from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# Create your models here.
class Todo(models.Model):
	user=models.ForeignKey(User,on_delete=models.CASCADE)
	date_created=models.DateTimeField(default=timezone.now)
	title=models.CharField(max_length=500)
	def __str__(self):
		return self.title