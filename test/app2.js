require("dotenv").config(); // טוען את הקונפיגורציה מהקובץ .env.
const express = require("express"); // מייבא את החבילה express כדי ליצור אפליקציה ולנהל את הנתיבים והבקשות.
const morgan = require("morgan");
const hbs = require("express-handlebars");
const mysql = require("mysql");
const app = express(); // יוצר אפליקציה חדשה באמצעות החבילה express.
const geminiModel = require("./API/V1/models/gemini");

// התחברות למסד הנתונים
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  database: "'webai'",
});
connection.connect(() => {
  console.log("Connected to MySQL");
});
global.db = connection; ///יצירת משתנה גלובלי בשם דיבי שמחזיק את הקונקשיין

app.use(morgan("combined"));
app.use(express.json()); // משתמש ב-body-parser כדי לאפשר קריאת JSON מהבקשות POST.

app.get("/", (req, res) => {
  // המחלקה app מגדירה נקודת כניסה לנתיב הראשי של האפליקציה.
  res.sendFile(__dirname + "/index.html"); // שולח קובץ HTML כתשובה לבקשת GET לנתיב הראשי.
});

app.post("/generate", async (req, res) => {
  // המחלקה app מגדירה נקודת כניסה לנתיב "/generate" של האפליקציה, המקבלת בקשות POST.
  if (!req.body || !req.body.prompt) {
    // בודק האם יש נתונים בבקשה או אם חסר פרמטר 'prompt'.
    return res.status(400).json({ error: "Missing prompt in request body" }); // מחזיר שגיאה 400 אם יש פקודת מתחילה בלי הגדרת טקסט.
  }

  const prompt = req.body.prompt; // מקבל את הפרמטר 'prompt' מהבקשה.
  try {
    const result = await geminiModel.generateContent(prompt); // מנסה ליצור תוכן באמצעות מודל ה-Gemini AI והפרמטר 'prompt'.
    const response = result.response; // מקבל את התשובה מהמודל. // הוספת טקסט למסד הנתונים
    await addTextToDatabase(response.text());
    res.json({ text: response.text() }); // שולח תשובה בפורמט JSON הכולל את הטקסט שנוצר על ידי מודל ה-Gemini AI.
  } catch (error) {
    console.error(error); // רישום שגיאות
    res.status(500).json({ error: "Error generating content" }); // מחזיר שגיאה 500 אם יש בעיה ביצירת התוכן.
  }
});
app.use("/", geminiRoute);
module.exports = app;
