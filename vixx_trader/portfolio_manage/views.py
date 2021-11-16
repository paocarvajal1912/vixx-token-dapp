from django.shortcuts import render

# Create your views here.
def portfolio(request):
    return render(request, "portfolio_manage/portfolio.html")

