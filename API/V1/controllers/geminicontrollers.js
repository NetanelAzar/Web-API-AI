// ייבוא מודל Text מקובץ `models/text.js`
const Text = require("../models/text");
const { GoogleGenerativeAI } = require("@google/generative-ai"); // מייבא מודול מחבילת @google/generative-ai המאפשר שימוש ב-Google ;
module.exports = {
  getText: async (req, res) => {
    const gemini_api_key = process.env.GEMINI_API_KEY; // מגדיר מפתח API ל-Gemini AI.
    const googleAI = new GoogleGenerativeAI(gemini_api_key); // יוצר אובייקט של Google Generative AI עם המפתח שנקבע.

    const geminiModel = googleAI.getGenerativeModel({
      // מקבל מודל ג'מיני AI עם ההגדרות שנקבעו.
      model: "gemini-pro",
    });

    const prompt = req.body.prompt;
    console.log(req.body);
    console.log(prompt);
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    const textDB = new Text({
        prompt,
        answer: response.text(),
      });
    
      // ////////////////////////////////////////////////////
      // שמירת מסמך טקסט חדש במסד הנתונים
      // קבלת מזהה טקסט
      // ////////////////////////////////////////////////////
      await textDB.save();
    
     
    return res.status(200).json({ text });
    
  },
  textGenerator: (req, res) => {
      // ניתוב GET לנתיב /text
  const text = require("../models/text"); // יבוא מודל text
  const fullName = req.user; // משתמש במידע המזוהה עם המשתמש מהמידלוור
  text.find().lean().then((text) => {
      // שאילתת מסד נתונים לטקסט
      return res.status(200).render("text", { layout: "main", title: "my texts", text,username: fullName  }); // תצוגת טקסט
    });
    
  },


  logIN:(req, res) => {
    return res.status(200).render("login", { layout: "main" });
  },
};





