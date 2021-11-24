from django.contrib import admin

from .models import(
    Portfolio,
    Transaction,
)

admin.site.register(Portfolio)
admin.site.register(Transaction)