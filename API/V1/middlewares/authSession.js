const jwt = require("jsonwebtoken"); // יבוא המודול jsonwebtoken

module.exports = (req, res, next) => { // יצירת מידלוור לאימות משתמש
  try {
    // קבלת פרטי המשתמש מהבקשה
    const { email, pass, fullName } = req.body;

    // יצירת טוקן JWT
    const token = jwt.sign({ email, pass, fullName }, process.env.PRIVATE_KEY, {
      expiresIn: "1h",
    });

    // הגדרת הטוקן בסשן
    req.session.user = token;

    next(); // המשך לפונקציה הבאה בשרשרת המידלוורים
  } catch (err) {
    console.log(err); // במקרה של שגיאה
    return res.status(401).json({ msg: "Unauthorized" }); // החזרת תשובת שגיאה כאשר הכניסה אינה מורשת
  }
};
