from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core.mail import send_mail
import string
import random
import json
from django.conf import settings
import ssl
import smtplib
from email.message import EmailMessage
from django.views.decorators.http import require_http_methods
from django.contrib.auth import get_user_model

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

@csrf_exempt
@require_http_methods(["POST"])
def enable_2fa_api(request):
    if not request.user.twofa_enabled:
        request.user.twofa_enabled = True
        request.user.save()
        return JsonResponse({'message': '2FA enabled successfully'})
    else:
        return JsonResponse({'error': '2FA is already enabled for this user'}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def disable_2fa_api(request):
    if request.user.twofa_enabled:
        request.user.twofa_enabled = False
        request.user.save()
        return JsonResponse({'message': '2FA disabled successfully'})
    else:
        return JsonResponse({'error': '2FA is not enabled for this user'}, status=400)

@csrf_exempt
def send_otp_email_api(request):
    if request.method == 'POST':
        if request.user.twofa_enabled:
            otp = generate_otp()
            request.session['otp'] = otp
            request.session.set_expiry(300)
            send_otp_email(request.user, otp)  
            return JsonResponse({'message': 'OTP sent successfully', 'expires_in': 300, 'otp': otp}, status=200)
        else:
            return JsonResponse({'error': '2FA is not enabled for this user'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def verify_otp_api(request):
    if request.method == 'POST':
        try:
            print("Enter")
            data = json.loads(request.body)
            received_otp = data.get('otp')
            stored_otp = request.session.get('otp')
            if stored_otp and str(received_otp) == stored_otp:
                del request.session['otp']
                return JsonResponse({'message': 'OTP verified successfully'})
            else:
                print("OTP")
                return JsonResponse({'error': 'Invalid OTP'}, status=400)
        except json.JSONDecodeError:
            print("JSON")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        print("ELSE")
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def send_otp_email(user, otp):
    em = EmailMessage()
    em['From'] = settings.EMAIL_HOST_USER
    em['To'] = user.email
    em['Subject'] = 'Your OTP for Two-Factor Authentication'
    em.set_content(f'Your OTP is: {otp}')
    context = ssl.create_default_context()
    with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
        server.starttls(context=context)
        server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        server.send_message(em) 
        server.quit()


from user_auth.jwt_utils import * 

@csrf_exempt
@require_http_methods(["GET"])
def check_2fa_status(request):
  try:
    token = request.COOKIES.get('jwt')
    user = JWTHandler.get_user_from_token(token)
    print('2fa')
    print(user.username)
    print(user.twofa_enabled)
    print(user.email)
    # user_identifier = request.GET.get('user_identifier')
    # if not user_identifier:
    #     return JsonResponse({'error': 'User identifier not provided.'}, status=400)
    # User = get_user_model()
    # try:
    #     user = User.objects.get(username=user_identifier)
    # except User.DoesNotExist:
    #     return JsonResponse({'error': 'User not found.'}, status=404)
    return JsonResponse({'twofa_enabled': user.twofa_enabled}, status=200)
  except Exception as e:
    return JsonResponse({'error': {e}}, status=400)