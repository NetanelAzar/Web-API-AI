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



// Middleware function
const middlewareFunction = (req, res, next) => {
  let onlineUsersCount = 0;
  // Iterating through all active sessions and counting online users
  req.sessionStore.all((err, sessions) => {
      if (err) {
          console.error("Error counting online users:", err);
          return next(err);
      }
      for (let sessionID in sessions) {
          if (sessions[sessionID].user && sessions[sessionID].user.online) {
              onlineUsersCount++;
          }
      }
      console.log('מספר המשתמשים המחוברים ברגע זמן זה:', onlineUsersCount);
      // Continue with your logic here
      next();
  });
};

module.exports = middlewareFunction;
