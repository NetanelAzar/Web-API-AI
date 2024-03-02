const { GoogleGenerativeAI } = require("@google/generative-ai"); // מייבא מודול מחבילת @google/generative-ai המאפשר שימוש ב-Google Generative AI.
const gemini_api_key = process.env.GEMINI_API_KEY; // מגדיר מפתח API ל-Gemini AI.
const googleAI = new GoogleGenerativeAI(gemini_api_key); // יוצר אובייקט של Google Generative AI עם המפתח שנקבע.

const geminiConfig = {
  // מגדיר הגדרות עבור ג'מיני AI.
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  // מקבל מודל ג'מיני AI עם ההגדרות שנקבעו.
  model: "gemini-pro",
  geminiConfig,
});

module.exports = geminiModel;
