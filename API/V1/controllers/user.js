const User = require("../models/user"); // יבוא מודל user
const bcrypt = require("bcrypt"); // יבוא המודול bcrypt
const jwt = require("jsonwebtoken"); // יבוא המודול jsonwebtoken

module.exports = {
  getAllUsers: (req, res) => {
    // פונקציה לקבלת כל המשתמשים
    User.find().then((data) => {
      // מציאת כל המשתמשים במודל user
      return res.status(200).json(data); // החזרת נתוני המשתמשים בפורמט JSON
    });
  },

  getUserById: (req, res) => {
    // פונקציה לקבלת משתמש לפי מזהה
    let userId = req.params.id; // השגת מזהה מהבקשה
    User.findOne({ userId }).then((data) => {
      // מציאת משתמש לפי המזהה
      return res.status(200).json(data); // החזרת המשתמש בפורמט JSON
    });
  },

  addUser: (req, res) => {
    // פונקציה להוספת משתמש חדש
    let body = req.body; // קבלת גוף הבקשה
    User.insertMany([body]).then((data) => {
      // הוספת משתמש חדש למודל user
      return res.status(200).json(data); // החזרת נתונים על הוספת המשתמש בפורמט JSON
    });
  },

  updateUser: (req, res) => {
    // פונקציה לעדכון משתמש
    let body = req.body; // קבלת גוף הבקשה
    let userId = req.params.id; // השגת מזהה מהבקשה
    User.updateOne({ userId }, body).then((data) => {
      // עדכון המשתמש לפי המזהה
      return res.status(200).json(data); // החזרת נתונים על העדכון בפורמט JSON
    });
  },

  deleteUser: (req, res) => {
    // פונקציה למחיקת משתמש
    let userId = req.params.id; // השגת מזהה מהבקשה
    User.deleteOne({ userId }).then((data) => {
      // מחיקת המשתמש לפי המזהה
      return res.status(200).json(data); // החזרת נתונים על המחיקה בפורמט JSON
    });
  },

  register: (req, res) => {
    // פונקציה לרישום משתמש חדש
    const { userId, fullName, email, pass, phone } = req.body; // שליפת פרטי המשתמש מהבקשה
    User.find({ email }).then((results) => {
      // בדיקה אם כבר קיים משתמש עם כתובת האימייל
      if (results.length > 0) {
        // אם קיים משתמש עם כתובת האימייל
        return res.status(200).json({ message: "Email is already taken" }); // החזרת הודעת שגיאה
      } else {
        // אם אין משתמש עם כתובת האימייל
        bcrypt.hash(pass, 10).then((hashPass) => {
          // הצפנת הסיסמה
          User.insertMany({
            // הוספת המשתמש החדש למודל user
            userId,
            fullName,
            email,
            pass: hashPass,
            phone,
          }).then((results) => {
            // החזרת נתונים על הוספת המשתמש בפורמט JSON
            return res.status(200).json(results);
          });
        });
      }
    });
  },

  login: (req, res) => {
    // פונקציה להתחברות משתמש
    const { email, pass } = req.body; // שליפת פרטי המשתמש מהבקשה
    User.find({ email }).then((results) => {
      // מציאת המשתמש לפי האימייל
      if (results.length == 0)
        // אם לא נמצא משתמש עם האימייל
        return res.status(200).json({ message: "Email or Pass not found" }); // החזרת הודעת שגיאה

      const hashPass = results[0].pass; // שמירת הסיסמה המוצפנת
      bcrypt.compare(pass, hashPass).then((status) => {
        // בדיקת תואמות הסיסמה
        if (!status)
          // אם הסיסמה לא תואמת
          return res.status(200).json({ message: "Email or Pass not found" }); // החזרת הודעת שגיאה

        const myUser = results[0]; // שמירת פרטי המשתמש
        const token = jwt.sign(
          // יצירת טוקן
          { email, pass, fullName: myUser.fullName }, // נתונים לכלול בטוקן
          process.env.PRIVATE_KEY, // מפתח סודי להצפנה
          {
            expiresIn: "1h", // תוקף הטוקן
          }
        );
        req.session.user = token; // שמירת הטוקן ב-session
        return res // החזרת הודעת הצלחה והטוקן בפורמט JSON
          .status(200)
          .json({ message: "user login successfully", token });
      });
    });
  },
};
