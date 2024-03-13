
const User = require("../models/user"); // יבוא מודל user
const logIn=require("../models/login"); //
const bcrypt = require("bcrypt"); // יבוא המודול bcrypt
const jwt = require("jsonwebtoken"); // יבוא המודול jsonwebtoken

module.exports = {
  getAllUsers: (req, res) => {
    // פונקציה לקבלת כל המשתמשים
    
    User.find()
    .lean()
    .then((user) => {
      return res
        .status(200)
        .render("user", { layout: "main", title: "user", user }); //main
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
    const { fullName, email, password, phone } = req.body; // שליפת פרטי המשתמש מהבקשה
    User.find({ email }).then((results) => {
      // בדיקה אם כבר קיים משתמש עם כתובת האימייל
      if (results.length > 0) {
        // אם קיים משתמש עם כתובת האימייל
        return res.status(200).json({ message: "Email is already taken" }); // החזרת הודעת שגיאה
      } else {
        // אם אין משתמש עם כתובת האימייל
        bcrypt.hash(password, 10).then((hashPass) => {
          // הצפנת הסיסמה
          User.insertMany({
            // הוספת המשתמש החדש למודל user
            fullName,
            email,
            pass: hashPass,
            phone,
           /// picname,
          }).then((results) => {
            // החזרת נתונים על הוספת המשתמש בפורמט JSON
            return res.status(200).render("login",{ layout: "main", title: "Login" });

          });
        });
      }
    });
  },

  login: (req, res) => {
    const { email, password } = req.body;

    logIn.find({ email }).then((results) => {
    if (results.length === 0) {
      return res.status(200).json({ message: "Email or Pass not found" });
    }

    const hashPass = results[0].pass;
    
    if (!hashPass || hashPass.length === 0) {
      return res.status(200).json({ message: "Hashed password not found in database" });
    }

    bcrypt.compare(password, hashPass).then((status) => {
      if (!status) {
        return res.status(200).json({ message: "Email or Pass not found" });
      }
    
      const myUser = results[0];
      const token = jwt.sign(
        { email, password, fullName: myUser.fullName },
        process.env.PRIVATE_KEY,
        { expiresIn: "1h" }
      );
      req.session.user = token;
      return res.render("text", { layout: "main", title: "Login", username: myUser.fullName });
 
    });
  });
},













};