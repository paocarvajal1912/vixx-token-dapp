# WEB3 IMPORTS
import os
import json

from web3   import Web3
from dotenv import load_dotenv

# DJANGO IMPORTS
from django.http                    import HttpResponseRedirect
from django.contrib                 import messages
from django.core.paginator          import Paginator
from django.shortcuts               import render, redirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth            import authenticate
from django.contrib.auth            import logout, login
from django.conf                    import settings

from .forms  import (
    UserCreateForm,
)

# Kovan Account
# PUBLIC_KEY  = os.getenv("PUBLIC_KEY")
PUBLIC_KEY  = settings.WALLET["PUBLIC_KEY"]
PRIVATE_KEY = settings.WALLET["PRIVATE_KEY"]

# Alchemy KovanApp URL
URL  = settings.CONTRACT["ALCHEMY_URL_KEY"]
WEB3 = Web3(Web3.HTTPProvider(URL))

# Contract's Address and ABI
ADDRESS = WEB3.toChecksumAddress(settings.CONTRACT["SMART_CONTRACT_ADDRESS"])

ABI_PATH = r"C:\Users\JasonGarcia24\FINTECH\workspace\vixx-token-dapp\vixx_trader\portfolio_manage\contracts\compiled\abi.json"
with open(ABI_PATH) as f:
    ABI = json.load(f)

breakpoint()
contract = WEB3.eth.contract(address=ADDRESS, abi=ABI)

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
    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user     = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("home")
        else:
            messages.info(request, "Username OR password is incorrect")
    
    context = {}
    return render(request, "registration/login.html", context)


@login_required(login_url="login")
def logout_view(request):
    logout(request)
    return redirect("login")


@login_required(login_url="login")
def home(request):
    context = {}

    return render(request, "portfolio_manage/home.html", context)