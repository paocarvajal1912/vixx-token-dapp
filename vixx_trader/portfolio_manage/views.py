# WEB3 IMPORTS
import os
import json
import requests

import pandas as pd
import numpy  as np

from dotenv            import load_dotenv
from plotly.offline    import plot
from plotly.graph_objs import Scatter

# DJANGO IMPORTS
from django.contrib            import messages
from django.views.generic.edit import UpdateView
from django.shortcuts          import render, redirect
from django.conf               import settings
from django.http               import HttpResponse


from .models import Portfolio

from .forms  import (
    UserCreateForm,
    PortfolioUpdateForm,
    TransactionCreateForm,
)

from .utils.web3 import web3backend

WEB3BACKEND = web3backend()


def home(request):
    # breakpoint()
    # if request.method == "POST":
    #     gh = 1
    #     breakpoint()
    
    transactions = {}

    plot_growth, plot_returns = plot_performance()
    
    this_portfolio = Portfolio.objects.get(address=WEB3BACKEND["public_key"])    
    print(this_portfolio.nickname)

    context = {
        "user":           this_portfolio.user,
        "balance":        this_portfolio.balance,
        "nickname":       "//s".join(this_portfolio.nickname.split(" ")),
        "public_address": this_portfolio.address,
        "coin_cost":      1.4,
        "plot_growth":    plot_growth,
        "plot_returns":    plot_returns,
        **transactions,
    }

    return render(request, "portfolio_manage/home.html", context)


def about(request):
    context = {}
    return render(request, "portfolio_manage/about.html", context)


def portfolio(request):
    if request.method == "POST":
        public_address = request.POST["out_public_address"]
    elif request.method == "GET":
        public_address = request.GET["id"]

    print(public_address)
    response     = get_etherscan_response(public_address) if public_address != "0x00..." else {"result": {}}
    df_response  = pd.DataFrame.from_dict(response["result"])
    transactions = meta_transaction_list(df_response) if not df_response.empty else {}
    print(transactions)

    this_portfolio = Portfolio.objects.get(address=WEB3BACKEND["public_key"])

    context = {
        "user":             this_portfolio.user,
        "balance":          this_portfolio.balance,
        "nickname":         "//s".join(this_portfolio.nickname.split(" ")),
        "public_address":   this_portfolio.address,
        "contract_address": WEB3BACKEND["contract_address"],
        "coin_cost":        1.4,
        **transactions,
    }

    return render(request, "portfolio_manage/portfolio_page.html", context)


def plot_performance():
    _file = os.path.join(settings.BASE_DIR, "portfolio_manage/data", "vixcoin_performance.csv")

    df = pd.read_csv(
        _file,
        index_col="Date",
        parse_dates=True,
        infer_datetime_format=True
    )

    x_data = df.index

    y_data_signal_growth = df["ML Signal"].map({0: np.nan, 1: 1}) * df["VIXM Growth"]
    
    y_data_vixm_returns = df["VIXM Returns"]
    y_data_spy_returns  = df["SPY Returns"]
    y_data_vxcn_returns = df["VXCN Returns"]

    y_data_vixm_close   = df["VIXM Close"]
    y_data_spy_close    = df["SPY Close"]

    y_data_vixm_growth  = df["VIXM Growth"]
    y_data_spy_growth   = df["SPY Growth"]
    y_data_vxcn_growth  = df["VXCN Growth"]

    # --- Growth Plots
    trace_vixm_growth = Scatter(
        x=x_data,
        y=y_data_vixm_growth,
        mode='lines',
        name="VIXM",
        opacity=0.8,
        marker_color='green',
        # customdata=customdata,
        # hovertemplate=hovertemplate,
        # legendrank=1,
        # showlegend=False,
    )

    trace_signal_growth = Scatter(
        x=x_data,
        y=y_data_signal_growth,
        mode='markers',
        name="Entry Points",
        opacity=0.8,
        marker_color='purple',
        marker_symbol="triangle-up",
        marker_size=8,
        visible="legendonly",
        # customdata=customdata,
        # hovertemplate=hovertemplate,
        # legendrank=1,
        # showlegend=False,
    )

    trace_spy_growth = Scatter(
        x=x_data,
        y=y_data_spy_growth,
        mode='lines',
        name="SPY",
        opacity=0.8,
        marker_color='red',
        # customdata=customdata,
        # hovertemplate=hovertemplate,
        # legendrank=1,
        # showlegend=False,
    )

    trace_vxcn_growth = Scatter(
        x=x_data,
        y=y_data_vxcn_growth,
        mode='lines',
        name="VIXCOIN",
        opacity=0.8,
        marker_color='blue',
        # customdata=customdata,
        # hovertemplate=hovertemplate,
        # legendgroup="sma-lines",
        # legendgrouptitle_text="Simple Moving Avgs",
        # legendrank=2,
    )

    # --- Returns Plots
    trace_vixm_returns = Scatter(
        x=x_data,
        y=y_data_vixm_growth,
        mode='lines',
        name="VIXM",
        opacity=0.8,
        marker_color='green',
        # customdata=customdata,
        # hovertemplate=hovertemplate,
        # legendrank=1,
        # showlegend=False,
    )

    trace_spy_returns = Scatter(
        x=x_data,
        y=y_data_spy_growth,
        mode='lines',
        name="SPY",
        opacity=0.8,
        marker_color='red',
        # customdata=customdata,
        # hovertemplate=hovertemplate,
        # legendrank=1,
        # showlegend=False,
    )

    trace_vxcn_returns = Scatter(
        x=x_data,
        y=y_data_vxcn_growth,
        mode='lines',
        name="VXCN",
        opacity=0.8,
        marker_color='blue',
        # customdata=customdata,
        # hovertemplate=hovertemplate,
        # legendrank=1,
        # showlegend=False,
    )

    plt_growth = plot(
        [trace_vxcn_growth, trace_vixm_growth, trace_spy_growth, trace_signal_growth],
        output_type="div",
    )

    plt_returns = plot(
        [trace_vxcn_returns, trace_vixm_returns, trace_spy_returns],
        output_type="div",
    )

    return [plt_growth, plt_returns]


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
