from rest_framework.response import Response    
from rest_framework import status
from Insightio.models import User,Prediction
from .serializers import UserSerializer,PredictionSerializer
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import check_password
import jwt
import datetime
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from django.http import JsonResponse
from scrapeomatic.collectors.instagram import Instagram
from tensorflow.keras.models import load_model
import numpy as np
import json
import random
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = User.objects.filter(email=email).first()
    
    if user:
        generated_otp = str(random.randint(100000, 999999))
        send_otp_email(email, generated_otp)
        user.otp = generated_otp
        user.save()

        if check_password(password, user.password):            
            payload = {
                'id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=48),
                'iat': datetime.datetime.utcnow()
            }
                                
            token = jwt.encode(payload, key='secret', algorithm="HS256")
            response = Response()
            response.data = {
                'jwt': token,
                'status': 'success',
                'id': user.id,
            }
            return response
        else:
            return Response({'status': 'error', 'message': 'Wrong Password'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

def send_otp_email(receiver_email, otp):
    sender_email = "shahpurav308@gmail.com"
    sender_password = "npgb ndoe saio zghl"
    # Send the OTP to the user's email using Django's send_mail function
    subject = f'Otp for verification'
    message_content = f'''
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {{
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f6f8fa;
      margin: 0;
      padding: 0;
    }}

    .container {{
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      color: #333;
    }}

    h1 {{
      color: #3498db;
    }}

    p {{
      color: #555;
      line-height: 1.6;
    }}

    .otp-container {{
      background-color: #3498db;
      color: #ffffff;
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
      text-align: center;
      font-size: 24px;
      display:inline-block;
    }}
  </style>
</head>
<body>

  <div class="container">
    <h1>Sign Up OTP</h1>
    <p>Dear User,</p>
    <p>Your OTP for sign up is:</p>
    
    <div class="otp-container">
      <strong>{ otp }</strong>
    </div>
  </div>

</body>
</html>



'''
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = "OTP For Signup Verification"

# Attach the HTML content to the email
    message.attach(MIMEText(message_content, 'html'))

# Connect to the SMTP server and send the email
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())

@api_view(['POST'])
def checkOtp(request,pk):
    items = User.objects.get(id=pk)
    otp = request.data.get('otp')
    otp = str(otp)
    otp_1 = str(items.otp)
    print(otp)
    print(items.otp) 
    if otp_1 == otp:
        return Response({'status': 'success', 'message': 'User authenticated'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'error', 'message': 'Wrong OTP'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def signup(request):
    email = request.data.get('email')    
    user_email = User.objects.filter(email=email).first()
   
    if user_email is None:            
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():    
            serializer.save()
            return Response({'status': 'success', 'message': 'Data added successfully','email': email}, status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'message': 'Failed to add data'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'status': 'error', 'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

with open('./api/data.json', 'r') as file:
    json_data = json.load(file)

features = [list(profile.values())[:-1] for profile in json_data]

dummy_data = np.array(features)

scaler = StandardScaler()
scaler.fit(dummy_data)
                
@api_view(['POST'])
def predict(request):
    user_name = request.data.get('username')
    instagram_scraper = Instagram()
    user_name = str(user_name) 
    try:
        results = instagram_scraper.collect(user_name)
    except:
        return Response({'status': 'error', 'message':'User not found'})
    
    
    if results:
        ann_model = load_model("./Insightio/ann_model.h5")                        
        profile_pic = results['profile_pic_url']
        if(profile_pic):
            profile_pic = True
        features = [
            results['edge_followed_by']['count'], 
            results['edge_follow']['count'],
            len(results['biography_with_entities']['raw_text']),
            results["edge_owner_to_timeline_media"]['count'],  
            profile_pic,  
            results['is_private'],  
            len([i for i in user_name if i.isdigit()]),
            len(user_name)
        ]
        if(results):
            X_scaled = scaler.transform(np.array(features).reshape(1, -1))
            predictions = (ann_model.predict(X_scaled) > 0.5).astype(int)  
            data = {
                'username': user_name,
                'profilePhoto': results['profile_pic_url'],
                'prediction': predictions[0][0]
            }          
            serializer = PredictionSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            return Response({'prediction': predictions[0][0],"results":results})
        else:
            return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_200_OK)
        


@api_view(['GET'])
def scrape_instagram_data(request):
    user_name = "aaasdasdadasas asdasf asf as f asf"
    instagram_scraper = Instagram()
    results = instagram_scraper.collect(user_name)
    
    return JsonResponse(results)

@api_view(['GET'])
def get_predictions(request):
    predictions = Prediction.objects.all()
    serializer = PredictionSerializer(predictions, many=True)
    if predictions:
        return Response(serializer.data)
    else:
        return Response({'status': 'error', 'message': 'No predictions found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_user_profile_by_id(request, pk):
    user = User.objects.filter(id=pk).first()
    if user:
        serializer = UserSerializer(user)
        return Response(serializer.data)
    else:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
def count_of_fake_real_profiles(request):
    predictions = Prediction.objects.all()
    fake = 0
    real = 0
    for prediction in predictions:
        if prediction.prediction == 1:
            fake += 1
        else:
            real += 1
    return Response({'fake': fake,'real':real})

@api_view(['POST'])
def month_wise_total_records(request):
    predictions = Prediction.objects.all()
    month_wise_records = {}
    for prediction in predictions:
        month = prediction.timestamp.strftime('%B')
        if month in month_wise_records:
            month_wise_records[month] += 1
        else:
            month_wise_records[month] = 1

    correct_order = {        
        'March': 0,
        'April': 0,
        'May': 0    
    }
    for key in month_wise_records:
        correct_order[key] = month_wise_records[key]
    month_wise_records = correct_order    
    return Response(month_wise_records)

@api_view(['GET'])
def report_profile(request, pk,uk):
    try:
        prediction = Prediction.objects.get(id=pk)
        user_name = User.objects.get(id=uk)
        user = prediction.username
        
        # Send report email
        emaill=os.getenv("RECEIVE_MAIL")
        res = send_report_email(emaill, user,user_name.name)
        
        # Update the isReported field
        prediction.isReported = True
        prediction.save()

        return Response({"username": user})
    except Prediction.DoesNotExist:
        return Response({"error": "Prediction does not exist"}, status=status.HTTP_404_NOT_FOUND)


def send_report_email(receiver_email, username,name):
    sender_email = os.getenv("EMAIL")
    sender_password =  os.getenv("PASS_KEY")
    # Send the OTP to the user's email using Django's send_mail function
    subject = f'Otp for verification'
    message_content = f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fake Account Alert Email</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f8ff; /* AliceBlue background */
        }}

        .email-container {{
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e0e6ed;
        }}

        .header {{
            background-color: #4682b4; /* SteelBlue header */
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }}

        .content {{
            padding: 30px;
            color: #333;
        }}

        .content h2 {{
            color: #4682b4;
        }}

        .alert {{
            background-color: #e0f7fa; /* Light cyan for alert message */
            border-left: 5px solid #0288d1; /* Blue accent */
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
            color: #01579b;
        }}

        .footer {{
            text-align: center;
            padding: 20px;
            background-color: #f0f8ff;
            color: #666;
            font-size: 12px;
        }}

        .footer a {{
            color: #4682b4;
            text-decoration: none;
        }}
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">Fake Account Alert</div>
        <div class="content">
            <h2>Hello,</h2>
            <p>
                We would like to bring to your attention that an Instagram account has been flagged as potentially
                fake or impersonating your profile.
            </p>
            <div class="alert">
                <strong>Account Details:</strong>
                <ul>
                    <li><strong>Username:</strong> {username}</li>
                    <li><strong>Reported By:</strong> {name}</li>
                </ul>
            </div>
            <p>
                Please take the necessary actions to report or verify this account by visiting Instagram's Help Center.
                For any further questions or concerns, feel free to reach out to our support team.
            </p>
            <p>Best Regards,<br>FPD</p>
        </div>
        <div class="footer">
            <p>
                <strong>Support Team</strong> | <a href="https://help.instagram.com/">Instagram Help Center</a>
            </p>
        </div>
    </div>
</body>

</html>


'''
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = "Fake Instagram Account Report"

# Attach the HTML content to the email
    message.attach(MIMEText(message_content, 'html'))

# Connect to the SMTP server and send the email
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())