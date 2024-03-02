const jwt = require("jsonwebtoken"); // ייבוא המודול jsonwebtoken
module.exports = (req, res, next) => {
  // ייצוא המידלוור לאימות משתמש
  try {
    const authHeader = req.headers.authorization; // קבלת הכותרת Authorization מהבקשה
    const arr = authHeader.split(" "); // פיצול הכותרת למערך על פי רווחים
    const token = arr[1]; // קבלת הטוקן מהמערך
    const user = jwt.verify(token, process.env.PRIVATE_KEY); // וודא את הטוקן והשג את המשתמש המתאים
    req.user = user; // הוספת המשתמש לבקשה עבור שימוש בקוד הבא
    next(); // המשך לתהליך הבא
  } catch (err) {
    console.log(err); // רישום שגיאה אם קיימת
    return res.status(401).json({ msg: "Unauthorized" }); // החזרת תשובת שגיאה עם קוד 401
  }
};
