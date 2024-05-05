from django.urls import path
from . import views

urlpatterns = [
  
    path('api/signup/',views.signup),
    path('api/login/',views.login),
    path('api/predict',views.predict),
    path('api/user/<int:pk>',views.get_user_profile_by_id),
    path('api/predictions',views.get_predictions),
    path('scrape-instagram/', views.scrape_instagram_data, name='scrape_instagram_data'),
    path('api/pieChart',views.count_of_fake_real_profiles),    
    path('api/lineChart',views.month_wise_total_records),    
    path('api/checkOtp/<int:pk>',views.checkOtp),       
    path('api/report/<int:pk>/<int:uk>',views.report_profile),    
]