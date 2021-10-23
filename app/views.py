from django.shortcuts import render,redirect,get_object_or_404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib import  messages
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils import timezone



from .models import POP,Transaction






@login_required
def dashboard_view(request):
    messages.info(request,("HEllo welcome"))
    return render(request, "dashboard.html")

@login_required
def trade_overview_view(request):
    messages.info(request,("HEllo welcome"))
    return render(request, "trade_overview.html")

@login_required
def withdraw_overview_view(request):
    user = request.user
    transactions = Transaction.objects.filter(user=user,transac_type='withdraw')
    messages.info(request,(f"HEllo welcome {user.username}"))
    return render(request, "withdraw_overview.html",{"transactions":transactions})

@login_required
def withdraw_view(request):
    user= request.user
    if request.POST:
        coin = request.POST.get('coin')
        amount = float(request.POST.get('amount'))
        wallet = request.POST.get('wallet')
        if user.balance > amount:
            Transaction.objects.create(user=user,status='pending',transac_type='withdraw',coin=coin,amount=amount)
            messages.info(request,("Withdrawal Placed"))
            return redirect("withdraw")
        else:
            messages.info(request,("Insufficient Funds"))
            return redirect("withdraw")
    else:
        return render(request, "withdraw.html")






@login_required
def deposite_overview_view(request):
    user = request.user
    transactions = Transaction.objects.filter(user=user,transac_type='deposite')
    messages.info(request,(f"HEllo welcome {user.username}"))
    return render(request, "deposite_overview.html",{"transactions":transactions})

@login_required
def deposite_view(request):
    user = request.user
    if request.POST:
        coin = request.POST.get('coin')
        amount = float(request.POST.get('amount'))
        transaction = Transaction.objects.create(user=user,coin=coin,amount=amount,transac_type="deposite",status='pending')
        messages.info(request,("Please confirm transaction"))
        return redirect(f"/confirm-deposite/?depositeID={transaction.id}")
    return render(request, "deposite.html")

@login_required
def deposite_confirm_view(request):
    user = request.user
    if request.POST:
        pop = request.POST.get("details")
        pk = int(request.POST.get('transaction_id'))
        transaction = Transaction.objects.get(pk=pk)
        proof_of_Pay = POP.objects.create(transaction=transaction,status='pending',pop=pop)
        messages.warning(request,("You Will Be Creadited Once Transaction is Approved"))
        return redirect("deposite")
    else:
        if request.GET.get('depositeID'):
            pk = request.GET.get('depositeID')
            if Transaction.objects.get(pk=pk):
                transaction = Transaction.objects.get(pk=pk)
                return render(request, "deposite_confirm.html",{"transaction":transaction})
            else:
                messages.warning(request,("Something Went Wrong"))
                return redirect("deposite")
        else:
            messages.warning(request,("Something Went Wrong"))
            return redirect("deposite")












def index_view(request):
    return render(request, "index.html")


def features_view(request):
    return render(request, "features.html")

def pricing_view(request):
    return render(request, "pricing.html")

def plans_view(request):
    return render(request, "plans.html")


def faq_view(request):
    return render(request, "faq.html")


def contact_view(request):
    return render(request, "contact.html")




