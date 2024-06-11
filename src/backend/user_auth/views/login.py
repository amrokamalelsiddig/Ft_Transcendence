import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login as django_login , get_user_model
from user_auth.models import WebUser
from django.views.decorators.csrf import csrf_exempt
from user_auth.jwt_utils import JWTHandler
from user_auth.views.twofa import generate_otp, send_otp_email
from django.core.exceptions import ObjectDoesNotExist

''' 
Why there is 3 functions for login?
login :
    The main login function. It authenticates the user and checks if 2FA is enabled.
    If 2FA is enabled, it generates and sends an OTP to the user and stores the OTP in the session.
    This function acts as the first step in the authentication process, handling initial user authentication
    and the decision on whether to proceed with 2FA.

proceed_with_login:
    This intermediate step is invoked for users who have 2FA enabled. It's responsible for generating
    and sending the OTP to the user's email. The OTP is also stored in the session for later verification.
    This function sets up the requirement for the next step in the authentication process, which is OTP verification.
    Note: In the provided context, 'proceed_with_login' is conceptually merged within 'login' function to handle
    the OTP sending process directly after initial authentication, thus might not be explicitly defined separately.

finalize_login:    
    Finalizes the login process. This function is called either after successful OTP verification
    for users with 2FA enabled or directly after the initial authentication for users without 2FA.
    It logs the user in, generates a JWT token, and sets it in the response cookie, completing the authentication flow
'''

@csrf_exempt
def login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            if user.twofa_enabled:
                otp = generate_otp()
                send_otp_email(user, otp)
                request.session['user_id'] = user.id
                request.session['otp'] = otp
                request.session.set_expiry(60)
                return JsonResponse({'message': '2FA enabled, OTP sent', 'requires_otp': True}, status=200)
            else:
                return finalize_login(request, user)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def verify_otp(request):
    if request.method == "POST":
        print("Verify1")
        print(request.body)
        data = json.loads(request.body)
        print("Verify2")
        received_otp = data.get('otp')
        print("Verify3")
        stored_otp = request.session.get('otp')
        print("Verify4")
        user_id = request.session.get('user_id')
        print("Verify5")
        if not all([received_otp, stored_otp, user_id]):
            print("OTP")
            return JsonResponse({'error': 'OTP verification failed'}, status=400)
        if received_otp == stored_otp:
            print("Verify6")
            del request.session['otp']
            print("Verify7")
            user = get_user_model().objects.get(id=user_id)
            print("Verify6")
            print(user)
            return finalize_login(request, user)
        else:

            return JsonResponse({'error': 'Invalid or expired OTP'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def finalize_login(request, user):
    print("Verify8")
    print(request)
    print(user)
    django_login(request, user)
    print("Verify9")
    token = JWTHandler.generate_jwt(user)
    print("Verify9")
    response = JsonResponse({'message': 'Login successful', 'requires_otp': False})
    print("Verify9")
    response.set_cookie(
        key='jwt',
        value=token,
        # httponly=True, this only for testing to prevent XXS attacks - NEED TO FIND ANOTHER WAY AROUND IT 
        max_age=3600,
        samesite='None',
        secure=True
    )
    print("Verify9")
    user.is_active = True
    return response