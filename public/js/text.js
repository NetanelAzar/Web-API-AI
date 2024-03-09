document.getElementById('btnGenerateText').addEventListener("click", (event)=> {
    let Prompt = document.getElementById('userGenerate').value;
    console.log(Prompt);
  
    fetch('/text', {
      method: 'POST',
      body: JSON.stringify({ Prompt }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res=> res.json()).then((data)=> {
   
      document.getElementById('innerText').innerText = data.text;
    });
  });
  