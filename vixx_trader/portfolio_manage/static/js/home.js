const COIN_COST = document.getElementsByName('coin_cost')[0].content;

function myClock() {
    setTimeout(function() {   
        const d = new Date();
        const n = d.toLocaleTimeString();
        document.getElementById("time_executed").value = n; 
        myClock();
    }, 1000)
}

function updateDepositCurrencyCost() {
    const depositCurrencyCost = document.getElementById("deposit_currency_cost");
    const depositCoinCount = document.getElementById("deposit_coin_count").value;

    depositCurrencyCost.value = (parseFloat(depositCoinCount) * parseFloat(COIN_COST)).toFixed(2);

    _defaultWithdrawCoin();
}

function updateDepositCoinCount() {
    const depositCurrencyCost = document.getElementById("deposit_currency_cost").value;
    const depositCoinCount = document.getElementById("deposit_coin_count");

    depositCoinCount.value = (parseFloat(depositCurrencyCost) / parseFloat(COIN_COST)).toFixed(6);

    _defaultWithdrawCoin();
}

function updateWithdrawCurrencyCost() {
    const withdrawCurrencyCost = document.getElementById("withdraw_currency_cost");
    const withdrawCoinCount = document.getElementById("withdraw_coin_count").value;

    withdrawCurrencyCost.value = (parseFloat(withdrawCoinCount) * parseFloat(COIN_COST)).toFixed(2);

    _defaultDepositCoin();
}

function updateWithdrawCoinCount() {
    const withdrawCurrencyCost = document.getElementById("withdraw_currency_cost").value;
    const withdrawCoinCount = document.getElementById("withdraw_coin_count");

    withdrawCoinCount.value = (parseFloat(withdrawCurrencyCost) / parseFloat(COIN_COST)).toFixed(6);

    _defaultDepositCoin();
}

function _defaultWithdrawCoin() {    
    const withdrawCoinCount = document.getElementById("withdraw_coin_count");
    const withdrawCurrencyCost = document.getElementById("withdraw_currency_cost");

    withdrawCoinCount.value = 0.00;
    withdrawCurrencyCost.value = 0.00;
}

function _defaultDepositCoin() {
    const depositCoinCount = document.getElementById("deposit_coin_count");
    const depositCurrencyCost = document.getElementById("deposit_currency_cost");

    depositCoinCount.value = 0.00;
    depositCurrencyCost.value = 0.00;
}

myClock();

