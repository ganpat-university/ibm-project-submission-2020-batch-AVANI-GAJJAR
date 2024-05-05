from django.shortcuts import redirect, render
from django.urls import reverse
from django.template import loader
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
import requests

# Create your views here.
def index(request):
    return render(request,'login.html')

def predict_ann(model, X):
    # Assuming 'scaler' is defined and X has the same features as during training
    X_scaled = scaler.transform(X)
    predictions = model.predict(X_scaled)
    return (predictions > 0.5).astype(int)


def dashboard(request):
        if request.method == 'POST':
            form = PredictionForm(request.POST)
            if form.is_valid():
                features = [form.cleaned_data['feature1'], form.cleaned_data['feature2']]
            # Add more features as needed

            # Assuming 'ann_model' is defined globally
                prediction = predict_ann(ann_model, np.array([features]))

                context = {'form': form, 'prediction': prediction[0]}
            return render(request, 'prediction_result.html', context)
        else:
            form = PredictionForm()

        context = {'form': form}
    return render(request,'dash_board.html')

def login_with_ibm_appid(request):
    # Redirect to IBM App ID for authentication
    redirect_url = f"{settings.IBM_APP_ID['OAUTH_SERVER_URL']}/authorization?response_type=code&client_id={settings.IBM_APP_ID['CLIENT_ID']}&redirect_uri={settings.IBM_APP_ID['REDIRECT_URI']}"
    return redirect(redirect_url)

def ibm_appid_callback(request):
    try:
        # Handle callback from IBM App ID and exchange code for tokens
        code = request.GET.get('code')

        token_url = f"{settings.IBM_APP_ID['OAUTH_SERVER_URL']}/token"
        token_params = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': settings.IBM_APP_ID['CLIENT_ID'],
            'client_secret': settings.IBM_APP_ID['CLIENT_SECRET'],
            'redirect_uri': settings.IBM_APP_ID['REDIRECT_URI'],
        }

        response = requests.post(token_url, data=token_params)
        token_data = response.json()

        # Validate and decode ID token
        id_token = token_data.get('id_token')
        decoded_token = validate_and_decode_id_token(id_token)

        # Use the user information from the decoded token to create or update a Django user
        user = authenticate(request, ibm_appid_user=decoded_token)
        
        if user is not None:
            login(request, user)
            return redirect('/')
        else:
            # Handle the case where user authentication fails
            return render(request, 'error.html', {'error_message': 'User authentication failed'})

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in ibm_appid_callback: {str(e)}")
        return render(request, 'error.html', {'error_message': 'An internal error occurred'})

def validate_and_decode_id_token(id_token):
    # Use python-jose and python_jwt to validate and decode the ID token
    from jose import jwt

    public_key = requests.get(f"{settings.IBM_APP_ID['OAUTH_SERVER_URL']}/publickeys").json()['keys'][0]
    decoded_token = jwt.decode(id_token, public_key, algorithms=['RS256'], audience=settings.IBM_APP_ID['CLIENT_ID'])

    return decoded_token

def logout_view(request):
    logout(request)
    return HttpResponse("Logged out successfully.")