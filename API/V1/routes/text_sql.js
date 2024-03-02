const routes = require("express").Router();
const geminiModel = require("../models/gemini");
const { addTextToDatabase } = require("../controllers/text_sql");

// נתיבים
routes.get("/", (req, res) => {
  res.sendFile(__dirname + "/main.html");
});

routes.post("/generate", async (req, res, next) => {
  // בדיקת קיום נתונים
  if (!req.body || !req.body.prompt) {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }

  const prompt = req.body.prompt;

  try {
    // יצירת תוכן
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;

    const newData = {
      userAI: prompt,
      textAI: response.text(),
    };
    // הוספת טקסט למסד נתונים
    await addTextToDatabase(newData, req, res);

    // שליחת תשובה
    res.json({ text: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating content" });
  }
});

module.exports = routes;
