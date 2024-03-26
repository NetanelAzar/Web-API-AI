// אחזור של שערי החליפין
fetch('https://open.er-api.com/v6/latest/USD')
  .then(response => response.json())
  .then(data => {
    const dollarRate = data.rates.ILS.toFixed(2);
    document.getElementById('exchangeRate').innerHTML = `₪ שער הדולר הנוכחי:  ${dollarRate}`;
  });

// אחזור של מחיר הביטקוין
fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json')
  .then(response => response.json())
  .then(data => {
    const bitcoinRate = data.bpi.USD.rate;
    document.getElementById('bitcoinRate').innerHTML = `$ מחיר הביטקוין הנוכחי: ${bitcoinRate}`;
  });

// אחזור של שער האירו
fetch('https://api.exchangerate-api.com/v4/latest/EUR')
  .then(response => response.json())
  .then(data => {
    const euroRate = data.rates.ILS.toFixed(2);
    document.getElementById('euroRate').innerHTML = `₪ שער האירו הנוכחי: ${euroRate}`;
  });
