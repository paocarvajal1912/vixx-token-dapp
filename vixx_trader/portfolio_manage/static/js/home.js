const coin_cost = document.getElementsByName('coin_cost')[0].content;

function myClock() {
    setTimeout(function() {   
        const d = new Date();
        const n = d.toLocaleTimeString();
        document.getElementById("time_executed").value = n; 
        myClock();
    }, 1000)
}

function updateDepositCurrencyCost() {
    const currencyCost = document.getElementById("deposit_currency_cost");
    const coinCount = document.getElementById("deposit_coin_count").value;

    currencyCost.value = (parseFloat(coinCount) * parseFloat(coin_cost)).toFixed(2);
}

function updateDepositCoinCount() {
    const currencyCost = document.getElementById("deposit_currency_cost").value;
    const coinCount = document.getElementById("deposit_coin_count");

    coinCount.value = (parseFloat(currencyCost) / parseFloat(coin_cost)).toFixed(6);
}

function updateWithdrawCurrencyCost() {
    const currencyCost = document.getElementById("withdraw_currency_cost");
    const coinCount = document.getElementById("withdraw_coin_count").value;

    currencyCost.value = (parseFloat(coinCount) * parseFloat(coin_cost)).toFixed(2);
}

function updateWithdrawCoinCount() {
    const currencyCost = document.getElementById("withdraw_currency_cost").value;
    const coinCount = document.getElementById("withdraw_coin_count");

    coinCount.value = (parseFloat(currencyCost) / parseFloat(coin_cost)).toFixed(6);
}

myClock();

