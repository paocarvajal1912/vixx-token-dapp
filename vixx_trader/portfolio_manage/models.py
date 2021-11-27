from django.db import models

from django.db.models.fields import CharField


class Portfolio(models.Model):
    address     = CharField(unique=True, max_length=64)
    user        = CharField(unique=False, max_length=16, default="")
    nickname    = CharField(max_length=20, unique=False, default="")
    balance     = models.FloatField(default=0.0)
    coin_count  = models.FloatField(default=0.0)

    def __str__(self):
        return self.address
    
    def get_absolute_url(self):
        return '/portfolio/list'


class Transaction(models.Model):
    ALLOWABLE_CURRENCIES = (
        ("USD", "US Dollar"),
        ("EUR", "Euro"),
        ("SVC", "Colon"),
    )

    time_executed     = models.DateTimeField()
    coin_count        = models.FloatField(default=0.0)
    coin_cost         = models.FloatField(default=0.0)
    purchase_currency = CharField(max_length=5, unique=False, default="USD", choices=ALLOWABLE_CURRENCIES)
    message           = CharField(max_length=35, default="")
    portfolio         = models.ForeignKey(Portfolio, on_delete=models.CASCADE)

    # def __str__(self):
    #     return f"{self.coin.name} --> {self.portfolio.nickname}"

