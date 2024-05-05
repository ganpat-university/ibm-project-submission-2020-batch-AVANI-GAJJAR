from django.db import models


# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=50 )
    email = models.CharField(max_length=100 ) 
    password = models.CharField(max_length=100 ) 
    otp=models.CharField(default=000000,max_length=6)
    def __str__(self):
        return(f"{self.name}")
    

class Prediction(models.Model):
    username = models.CharField(max_length=50 )
    profilePhoto = models.TextField()
    prediction = models.BooleanField() 
    timestamp = models.DateTimeField(auto_now_add=True)
    isReported = models.BooleanField(default=False)