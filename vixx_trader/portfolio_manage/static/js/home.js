const coin_cost = document.getElementsByName('coin_cost')[0].content;

function myClock() {
    setTimeout(function() {   
        const d = new Date();
        const n = d.toLocaleTimeString();
        document.getElementById("time_executed").value = n; 
        myClock();
    }, 1000)
}

function updateCurrencyCost() {
    const currencyCost = document.getElementById("currency_cost");
    const coinCount = document.getElementById("coin_count").value;

    currencyCost.value = (parseFloat(coinCount) * parseFloat(coin_cost)).toFixed(2);
}

function updateCoinCount() {
    const currencyCost = document.getElementById("currency_cost").value;
    const coinCount = document.getElementById("coin_count");

    coinCount.value = (parseFloat(currencyCost) / parseFloat(coin_cost)).toFixed(6);
}

myClock();

