from django.urls import path,include
from . import views

urlpatterns = [
     
    path('', views.index_view, name="index"),
    path('features/', views.features_view, name="features"),
    path('pricing/', views.pricing_view, name="pricing"),
    path('plans/', views.plans_view, name="plans"),
    path('faq/', views.faq_view, name="faq"),
    path('contact/', views.contact_view, name="contact"),


    path('my-dashboard/', views.dashboard_view, name="dashboard"),
    path('trading-overview/', views.trade_overview_view, name="trading_overview"),
    path('deposite-overview/', views.deposite_overview_view, name="deposite_overview"),
    path('deposite/', views.deposite_view, name="deposite"),
    path('confirm-deposite/', views.deposite_confirm_view, name="deposite_confirm"),
    path('withdraw-overview/', views.withdraw_overview_view, name="withdraw_overview"),
    path('withdraw/', views.withdraw_view, name="withdraw"),
]
