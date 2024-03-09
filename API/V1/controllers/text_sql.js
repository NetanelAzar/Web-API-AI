const mysql = require('mysql'); // יבוא הספריה של MySQL שישמשה ליצירת חיבור למסד הנתונים

const connection = mysql.createConnection({ // יצירת חיבור למסד הנתונים
  host: 'localhost', // כתובת המארח של מסד הנתונים
  user: 'your_username', // שם המשתמש למסד הנתונים
  password: 'your_password', // סיסמת המשתמש למסד הנתונים
  database: 'your_database' // שם המסד הנתונים שבו נרצה לבצע פעולות
});

connection.connect((err) => { // בדיקה של התחברות למסד הנתונים
  if (err) {
    console.error('Error connecting to database:', err); // במקרה של שגיאה בהתחברות
    return;
  }
  console.log('Connected to MySQL database'); // במקרה של התחברות הצליחה
});

module.exports = {
  getText: async (req, res) => { // פונקציה לקבלת טקסט מ-Google Generative AI ושמירתו במסד הנתונים
    const gemini_api_key = process.env.GEMINI_API_KEY; // הגדרת מפתח API ל-Gemini AI
    const googleAI = new GoogleGenerativeAI(gemini_api_key); // יצירת אובייקט של Google Generative AI

    const geminiModel = googleAI.getGenerativeModel({ // יצירת מודל ג'מיני AI
      model: "gemini-pro",
    });

    const prompt = req.body.Prompt; // השגת הפרמטר Prompt מהבקשה

    try {
      const result = await geminiModel.generateContent(prompt); // יצירת תוכן מגורמן על ידי המודל
      const response = await result.response;
      const text = response.text(); // השגת הטקסט מהתשובה
      console.log(text);

      connection.query('INSERT INTO texts (prompt, answer) VALUES (?, ?)', [prompt, text], (error, results, fields) => { // הכנסת הטקסט למסד הנתונים
        if (error) {
          console.error("Error inserting text:", error); // במקרה של שגיאה בהכנסת הטקסט
          return res.status(500).json({ error: "An error occurred" });
        }
        console.log("Text inserted successfully"); // במקרה של הצלחה בהכנסת הטקסט
        return res.status(200).json({ text });
      });
    } catch (error) {
      console.error("Error:", error); // במקרה של שגיאה כללית
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  textGenerator: (req, res) => { // פונקציה להבאת כל הטקסטים ממסד הנתונים
    connection.query('SELECT * FROM texts', (error, results, fields) => { // שאילתת SQL להבאת כל הטקסטים
      if (error) {
        console.error("Error fetching texts:", error); // במקרה של שגיאה בהבאת הטקסטים
        return res.status(500).json({ error: "An error occurred" });
      }
      console.log("Texts fetched successfully"); // במקרה של הצלחה בהבאת הטקסטים
      return res.status(200).render("text", { layout: "main", title: "my texts", text: results });
    });
  },

  logIN: (req, res) => { // פונקציה להצגת דף ההתחברות
    return res.status(200).render("login", { layout: "main" });
  },

  getTextById: (req, res) => { // פונקציה להבאת טקסט לפי ה-id שלו
    const textId = req.params.id; // שליפת ה-id מהבקשה
    connection.query('SELECT * FROM texts WHERE id = ?', [textId], (error, results, fields) => { // שאילתת SQL להבאת הטקסט לפי ה-id
      if (error) {
        console.error("Error fetching text by id:", error); // במקרה של שגיאה בהבאת הטקסט
        return res.status(500).json({ error: "An error occurred" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Text not found" }); // במקרה של טקסט לא נמצא
      }
      console.log("Text fetched by id successfully"); // במקרה של הצלחה בהבאת הטקסט
      return res.status(200).json({ text: results[0] });
    });
  },

  updateTextById: (req, res) => { // פונקציה לעדכון טקסט לפי ה-id שלו
    const textId = req.params.id; // שליפת ה-id מהבקשה
    const newText = req.body.text; // שליפת הטקסט החדש מהבקשה
    connection.query('UPDATE texts SET answer = ? WHERE id = ?', [newText, textId], (error, results, fields) => { // שאילתת SQL לעדכון הטקסט לפי ה-id
      if (error) {
        console.error("Error updating text by id:", error); // במקרה של שגיאה בעדכון הטקסט
        return res.status(500).json({ error: "An error occurred" });
      }
      console.log("Text updated by id successfully"); // במקרה של הצלחה בעדכון הטקסט
      return res.status(200).json({ message: "Text updated successfully" });
    });
  },

  deleteTextById: (req, res) => { // פונקציה למחיקת טקסט לפי ה-id שלו
    const textId = req.params.id; // שליפת ה-id מהבקשה
    connection.query('DELETE FROM texts WHERE id = ?', [textId], (error, results, fields) => { // שאילתת SQL למחיקת הטקסט לפי ה-id
      if (error) {
        console.error("Error deleting text by id:", error); // במקרה של שגיאה במחיקת הטקסט
        return res.status(500).json({ error: "An error occurred" });
      }
      console.log("Text deleted by id successfully"); // במקרה של הצלחה במחיקת הטקסט
      return res.status(200).json({ message: "Text deleted successfully" });
    });
  }
};
