# WEB3 IMPORTS
import os
import json
import requests

import pandas as pd

from dotenv   import load_dotenv

# DJANGO IMPORTS
from django.contrib                 import messages
from django.views.generic.edit      import UpdateView
from django.shortcuts               import render, redirect
from django.conf                    import settings

from .models import Portfolio

from .forms  import (
    UserCreateForm,
    PortfolioUpdateForm,
    TransactionCreateForm,
)

from .utils.web3 import web3backend

WEB3BACKEND = web3backend()


def home(request):
    transactions = {}
    
    this_portfolio = Portfolio.objects.get(address=WEB3BACKEND["public_key"])    
    print(this_portfolio.nickname)

    context = {
        "user": this_portfolio.user,
        "balance": this_portfolio.balance,
        "nickname": "//s".join(this_portfolio.nickname.split(" ")),
        "public_address": this_portfolio.address,
        "coin_cost": 1.4,
        **transactions,
    }
    
    return render(request, "portfolio_manage/home.html", context)


def about(request):
    context = {}
    return render(request, "portfolio_manage/about.html", context)


def portfolio(request):
    if request.method == "POST":
        public_address = request.POST["out_public_address"]
        response       = get_etherscan_response(public_address)
        df_response    = pd.DataFrame.from_dict(response["result"])
        transactions   = meta_transaction_list(df_response)
        print(transactions.keys())
    else:
        transactions = {}

    this_portfolio = Portfolio.objects.get(address=WEB3BACKEND["public_key"])    
    print(this_portfolio.nickname)

    context = {
        "user": this_portfolio.user,
        "balance": this_portfolio.balance,
        "nickname": "//s".join(this_portfolio.nickname.split(" ")),
        "public_address": this_portfolio.address,
        "coin_cost": 1.4,
        **transactions,
    }

    return render(request, "portfolio_manage/portfolio_page.html", context)


def get_etherscan_response(public_address):
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
    print("-------------- in etherscan getter")

    return response


def meta_transaction_list(transactions):
    columns2keep    = ["timeStamp", "hash", "from", "contractAddress", "to", "value", "gasUsed"]
    df              = transactions.filter(items=columns2keep)

    df["timeStamp"] = pd.to_datetime(df["timeStamp"], unit='s')
    df["date"]      = df["timeStamp"].dt.date
    df["time"]      = df["timeStamp"].dt.time
    df              = df.drop(columns=["timeStamp"])

    df = df.add_prefix("tx_")
    df = df.loc[df["tx_contractAddress"] == WEB3BACKEND["contract_address"].lower(), :]
    print(df.head())

    if df.empty:
        return {}
    else:
        df_dict = {col: df[col].to_list() for col in df.columns}
        df_dict = {key: "//s".join([str(val) for val in vals]) for key, vals in df_dict.items()}

        return df_dict


class PortfolioUpdate(UpdateView):
  model         = Portfolio
  template_name = "sandbox/portfolio_update_form.html"
  form_class    = PortfolioUpdateForm
