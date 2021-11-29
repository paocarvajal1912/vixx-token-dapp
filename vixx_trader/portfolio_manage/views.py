# WEB3 IMPORTS
import os
import json
import requests

import pandas as pd

from dotenv   import load_dotenv
from requests import Session


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

from .utils.web3 import web3backend


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
    if request.method == "POST":
        public_address = request.POST["out_public_address"]

        url = "http://api-kovan.etherscan.io/api" + \
              "?module=account"                   + \
              "&action=tokentx"                   + \
              f"&address={public_address}"        + \
              "&startblock=0"                     + \
              "&endblock=999999999"               + \
              "&sort=asc"                         + \
              f"&apikey={settings.ETHERSCAN['API_KEY']}"

        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, '
                                 'like Gecko) Chrome/50.0.2661.102 Safari/537.36'}

        response = requests.get(url, headers=headers)
        response = json.loads(response.content)

        df_response = pd.DataFrame.from_dict(response["result"])

        transactions = meta_transaction_list(df_response)
        print(transactions.keys())
    else:
        transactions = {}

    this_portfolio = Portfolio.objects.get(address=WEB3BACKEND["public_key"])    
    print(this_portfolio.nickname)

    # breakpoint()

    context = {
        "user": this_portfolio.user,
        "balance": this_portfolio.balance,
        "nickname": "//s".join(this_portfolio.nickname.split(" ")),
        "public_address": this_portfolio.address,
        "coin_cost": 1.4,
        **transactions,
    }

    return render(request, "portfolio_manage/portfolio_page.html", context)


def about(request):
    context = {}
    return render(request, "portfolio_manage/about.html", context)


def meta_transaction_list(transactions):
    columns2keep    = ["timeStamp", "hash", "from", "contractAddress", "to", "value", "gasUsed"]
    df              = transactions.filter(items=columns2keep)

    df["timeStamp"] = pd.to_datetime(df["timeStamp"], unit='s')
    df["date"]      = df["timeStamp"].dt.date
    df["time"]      = df["timeStamp"].dt.time
    df              = df.drop(columns=["timeStamp"])

    df = df.add_prefix("tx_")
    df = df.loc[df["tx_contractAddress"] == WEB3BACKEND["contract_address"].lower(), :]

    if df.empty:
        return {}
    else:
        df_dict = {col: df[col].to_list() for col in df.columns}
        df_dict = {key: "//s".join([str(val) for val in vals]) for key, vals in df_dict.items()}

        return df_dict


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
