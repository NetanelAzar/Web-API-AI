// ייבוא מודל Text מקובץ `models/text.js`
const Text = require("../models/text");
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require("@google/generative-ai"); // מייבא מודול מחבילת @google/generative-ai המאפשר שימוש ב-Google ;
module.exports = {
  getText: async (req, res) => {
    const gemini_api_key = process.env.GEMINI_API_KEY;
    const googleAI = new GoogleGenerativeAI(gemini_api_key);

    const geminiModel = googleAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const prompt = req.body.prompt;

    // Verify user session and extract user email
    if (!req.session || !req.session.user) {
      return res.status(400).send("User session is missing.");
    }

    // Decode user token to get the email
    jwt.verify(req.session.user, process.env.PRIVATE_KEY, (err, decoded) => {
      if (err) {
        console.error(err);
        return res.status(401).send("Failed to verify user token.");
      }

      const userEmail = decoded.email;

      // Generate content
      geminiModel.generateContent(prompt).then(async (result) => {
        const response = await result.response;
        const text = response.text();

        try {
          // Create a new Text document
          const textDB = new Text({
            prompt,
            answer: text,
            userEmail: userEmail
          });

          // Save the new Text document to the database
          await textDB.save();

          return res.status(200).json({ text });
        } catch (error) {
          console.error("Error occurred while saving data:", error);
          return res.status(500).send("Internal server error.");
        }
      }).catch((error) => {
        console.error("Error occurred while generating content:", error);
        return res.status(500).send("Failed to generate content.");
      });
    });
  },
  
  textGenerator: (req, res) => {
    jwt.verify(req.session.user, process.env.PRIVATE_KEY, (err, decoded) => {
      if (err) {
        console.error(err);
        return res.status(401).send("Failed to verify user token.");
      }
      const userEmail = decoded.email;
   

    // Find texts created by the current user
    Text.find({ userEmail: userEmail }).lean().then((texts) => {
      // Render the page with the texts created by the user
      return res.status(200).render("text", { layout: "main", title: "My Texts", text: texts, username: req.user,profileImage: req.session.profileImage });
    }).catch((error) => {
      console.error("Error occurred while fetching texts:", error);
      return res.status(500).send("Internal server error.");
    });
  })},
  


  logIN:(req, res) => {
    return res.status(200).render("login", { layout: "main" });
  },
};





