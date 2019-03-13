from django.db import models
from datetime import datetime
from django.utils import timezone   


class report(models.Model):
	id = models.AutoField(primary_key = True)
	current=models.IntegerField(default=0)
	volt=models.IntegerField(default=0)
	timestamp=models.CharField(default='00:00:00.00',max_length=50)



