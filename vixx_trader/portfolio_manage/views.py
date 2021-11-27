# WEB3 IMPORTS
import os
import json

from web3   import Web3
from dotenv import load_dotenv

# DJANGO IMPORTS
from django.http                    import HttpResponseRedirect
from django.contrib                 import messages
from django.core.paginator          import Paginator
from django.http                    import JsonResponse
from django.views.generic.edit      import CreateView, UpdateView
from django.shortcuts               import render, redirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth            import authenticate
from django.contrib.auth            import logout, login
from django.conf                    import settings

from .models import Portfolio

from .forms  import (
    UserCreateForm,
    PortfolioUpdateForm,
    TransactionCreateForm,
)


def web3backend():
    # Account Credentials
    public_key  = settings.WALLET["PRIMARY_PUBLIC_KEY"]
    private_key = settings.WALLET["PRIMARY_PRIVATE_KEY"]

    # Alchemy KovanApp URL
    url  = settings.CONTRACT["ALCHEMY_URL_KEY"]
    web3 = Web3(Web3.HTTPProvider(url))

    # Contract's Address and ABI
    contract_address = web3.toChecksumAddress(settings.CONTRACT["SMART_CONTRACT_ADDRESS"])
    abi_path         = settings.ABI_DIR(app="portfolio_manage")

    with open(abi_path) as f:
        abi = json.load(f)

    contract = web3.eth.contract(address=contract_address, abi=abi)

    return {
        "public_key":       public_key,
        "private_key":      private_key,
        "contract_address": contract_address,
        "abi_path":         abi_path,
        "contract":         contract,
    }

WEB3BACKEND = web3backend()


def signup_view(request):
    if request.user.is_authenticated:
        messages.info(request, f"Logged out of {request.user}")
        logout(request)
        
    form = UserCreateForm()
    context = {"form": form}

    if request.method == "POST":
        form = UserCreateForm(request.POST)
        if form.is_valid():
            form.save()

            user = form.cleaned_data.get("username")
            messages.success(request, f"Account created for {user}!")

            return redirect("login")

    return render(request, "registration/signup.html", context)


def login_view(request):
    breakpoint()
    # if request.user.is_authenticated:
    #     return redirect("home")

    if request.method == "POST":
        address = request.POST["public_address"]
        print(address)
        print(request.POST)

        # if address is not None:
            # login(request, user)
            # return redirect("home")
        # else:
        #     messages.info(request, "Username OR password is incorrect")
    
    context = {
        "public_address": WEB3BACKEND["public_key"],
    }

    return render(request, "registration/login.html", context)


@login_required(login_url="login")
def logout_view(request):
    logout(request)
    return redirect("login")


def home(request):
    this_portfolio = Portfolio.objects.get(address=WEB3BACKEND["public_key"])    
    transaction_create_form = transaction_create(request)
    print(this_portfolio.nickname)

    context = {
        "user": this_portfolio.user,
        "balance": this_portfolio.balance,
        "nickname": "\s".join(this_portfolio.nickname.split(" ")),
        "public_address": this_portfolio.address,
        **transaction_create_form,
    }

    return render(request, "portfolio_manage/home.html", context)


def about(request):
    context = {}
    return render(request, "portfolio_manage/about.html", context)


def transaction_create(request):
    this_portfolio = Portfolio.objects.get(address=WEB3BACKEND["public_key"])
    
    if request.method == "POST":
        print("--------------------- in transaction_create")
        form = TransactionCreateForm(request.POST)
        print(form)
        print(request.POST)

        print(float(request.POST["coin_count"]))
        this_portfolio.balance += float(request.POST["coin_count"])
        this_portfolio.save()
    else:
        form = TransactionCreateForm()

    context = {
        "form": form,
        "coin_cost": 1.4,
    }

    form.coin_cost = context["coin_cost"]

    return context

    # return render(request, "portfolio_manage/transaction_create.html", context)


# def transaction_create_view(request):
#     form = TransactionCreateForm(request.POST or None)
#     if form.is_valid():
#         form.save()

#     # Get the latest instance of the current coin
#     # coin_data_all    = Coin.objects.filter( Q(Coin___ticker = ticker.lower()))
#     # coin_data_length = len(coin_data_all)-1
#     # coin_data_now    = coin_data_all[coin_data_length]

#     # Get only this user's portfolios
#     # user_portfolios = [p for p in form.fields["portfolio"]._queryset if p.owner.username == request.user.username]

#     context = dict(
#         # portfolios    = user_portfolios,
#         # coin_name     = coin_data_now.name,
#         # start_date    = coin_data_now.start_date,
#         # price_open    = coin_data_now.price_open,
#         # price_high    = coin_data_now.price_high,
#         # price_low     = coin_data_now.price_low,
#         # price_close   = coin_data_now.price_close,
#         # volume_traded = coin_data_now.volume_traded,
#         # trades_count  = coin_data_now.trades_count,
#         # ticker        = ticker.upper(),
#         # coin_icon     = icon_path(coin_data_now.ticker.upper()),
#     )

#     return render(request, "portfolio_manage/transaction_create.html", context)


# def transaction_execute(request, ticker: str):
#     gh = 1


class PortfolioUpdate(UpdateView):
  model         = Portfolio
  template_name = "sandbox/portfolio_update_form.html"
  form_class    = PortfolioUpdateForm
