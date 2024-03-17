document.getElementById('btnGenerateText').addEventListener("click", (event)=> {
  // הבאת ערך הטקסט שהוזן על ידי המשתמש
  let prompt = document.getElementById('userGenerate').value;
  console.log(prompt);

  // שליחת בקשת POST לשרת עם הטקסט המוזן
  fetch('/text', {
    method: 'POST',
    body: JSON.stringify({ prompt }), // המרת הטקסט לפורמט JSON
    headers: {
      'Content-Type': 'application/json' // הגדרת סוג התוכן ל־JSON
    }
  }).then(res=> res.json()).then((data)=> {
 
    // עדכון התוכן בדף בהתאם לתשובה שקיבלנו מהשרת
    document.getElementById('innerText').innerText = data.text;
  });
});
