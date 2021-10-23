from django.urls import path,include
from . import views

urlpatterns = [
    path('login/', views.login_view, name="login"),
    path('logout/', views.logout_view, name="logout"),
    path('register/', views.register_view, name="register"),
    path('verify-email/', views.verify_email_view, name="verify-email"),
    path('activate/<uidb64>/<token>/', views.activate_account_view, name='activate'),
    path('my-account/', views.account_view, name="account"),
     
]
