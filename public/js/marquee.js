      // Fetch exchange rates
      fetch('https://open.er-api.com/v6/latest/USD')
      .then(response => response.json())
      .then(data => {
        const dollarRate = data.rates.ILS.toFixed(2);
        document.getElementById('exchangeRate').innerHTML = `₪ שער הדולר הנוכחי:  ${dollarRate}`;
      });

    // Fetch Bitcoin rate
    fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json')
      .then(response => response.json())
      .then(data => {
        const bitcoinRate = data.bpi.USD.rate;
        document.getElementById('bitcoinRate').innerHTML = `$ מחיר הביטקוין הנוכחי: ${bitcoinRate}`;
      });

