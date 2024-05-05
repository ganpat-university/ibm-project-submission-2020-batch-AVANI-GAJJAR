"""
URL configuration for Fake_Profile_Detection project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
# from Insightio import views
# from Insightio.views import login_with_ibm_appid, ibm_appid_callback, logout_view

urlpatterns = [
    # path('admin/', admin.site.urls),
    # path('admin/', admin.site.urls),
    # path('',views.index,name="index"),
    # path('dashboard',views.dashboard,name="dashboard"),
    # path('ibmappid/login/', login_with_ibm_appid, name='login_with_ibm_appid'),
    # path('ibmappid/callback/', ibm_appid_callback, name='ibm_appid_callback'),
    # path('ibmappid/logout/', logout_view, name='logout'),
    path('',include('api.urls'))

]
