import string

from django                     import forms
from django.contrib.auth.forms  import UserCreationForm
from django.contrib.auth.models import User
from django.contrib.auth        import get_user_model
from django.utils.translation   import ugettext_lazy as _



from .models import (
    Portfolio,
    Transaction,
)


class UserCreateForm(UserCreationForm):
    class Meta:
        model  = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "password1",
            "password2",
        ]


class PortfolioUpdateForm(forms.ModelForm):
    class Meta:
        model  = Portfolio
        fields = (
            "address",
            "nickname",
            "balance",
            "coin_count",
        )


class TransactionCreateForm(forms.ModelForm):
    class Meta:
        model  = Transaction
        fields = (
            "time_executed",
            "coin_count",
            "coin_cost",
            "purchase_currency",
            "message",
            "portfolio",
        )

