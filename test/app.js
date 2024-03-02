const API_KEY = "AIzaSyBZySpMY5e954jY_zh4uEDCX-VEidlicbM"; // מגדיר משתנה המכיל את מפתח ה-API.

const { GoogleGenerativeAI } = require("@google/generative-ai"); // מייבא את מודול ה-GoogleGenerativeAI מהחבילה @google/generative-ai.
require("dotenv").config(); // מגדיר את הקונפיגורציה מהקובץ .env.

const gemini_api_key = API_KEY; // משתמש במפתח ה-API שהוגדר ליצירת אובייקט של GoogleGenerativeAI.
const googleAI = new GoogleGenerativeAI(gemini_api_key); // יוצר אובייקט של GoogleGenerativeAI עם המפתח ה-API.

const geminiConfig = {
  // מגדיר הגדרות עבור מודל ה-Gemini AI.
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  // מייצר את מודל ה-Gemini AI עם ההגדרות שנקבעו.
  model: "gemini-pro",
  geminiConfig,
});

const generate = async () => {
  // מגדיר פונקציה אסינכרונית ליצירת תוכן.
  try {
    const prompt = process.argv.slice(2).join(" "); // מקבל את הפרמטרים שהוזנו בפקודת הפעלה ומצרף אותם למשפט אחד.
    const result = await geminiModel.generateContent(prompt); // מייצר תוכן על ידי מודל ה-Gemini AI עם הפרמטרים שהוזנו.
    const response = result.response; // מקבל את התשובה מהמודל.
    console.log(response.text()); // מדפיס את הטקסט שנוצר על ידי המודל.
  } catch (error) {
    console.log("response error", error); // מדפיס שגיאה אם יש בעיה ביצירת התוכן.
  }
};

generate(); // קריאה לפונקציה generate כדי להפעיל את התוכנית.
