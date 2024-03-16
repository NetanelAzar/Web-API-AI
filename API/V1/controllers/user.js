const User = require("../models/user"); // יבוא מודל user
const logIn = require("../models/login"); //
const bcrypt = require("bcrypt"); // יבוא המודול bcrypt
const jwt = require("jsonwebtoken"); // יבוא המודול jsonwebtoken
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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
    const { fullName, email, password, phone,picname,isAdmin } = req.body; // שליפת פרטי המשתמש מהבקשה
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
            picname,
            isAdmin,
           /// picname,
          }).then((results) => {
            // שליחת איימיל למשתמש שנרשם
            const mailOptions = {
              from: 'netanelazar880@gmail.com',
              to: email,
              subject: 'Welcome to our website!',
              text: 'Thank you for registering with us.'
            };

            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });

            // החזרת נתונים על הוספת המשתמש בפורמט JSON
            return res.status(200).render("login",{ layout: "main", title: "Login" });
          });
        });
      }
    });
  },
  login: (req, res) => {
    const { email, password, isAdmin } = req.body;

    // בדיקה אם האימייל והסיסמה נשלחו בבקשה
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    logIn.find({ email }).then((results) => {
        // אם לא נמצאו תוצאות עבור האימייל
        if (results.length === 0) {
            return res.status(404).json({ message: "Email or password incorrect" });
        }

        const hashPass = results[0].pass;

        // בדיקה אם לא נמצאה סיסמה מוצפנת בבסיס הנתונים
        if (!hashPass || hashPass.length === 0) {
            return res.status(500).json({ message: "Hashed password not found in database" });
        }

        // השוואת הסיסמה הקלה לסיסמה המוצפנת
        bcrypt.compare(password, hashPass).then((status) => {
            if (!status) {
                return res.status(401).json({ message: "Email or password incorrect" });
            }

            // אם הכל תקין - יצירת טוקן
            const myUser = results[0];
            
            const token = jwt.sign(
                { email, password, fullName: myUser.fullName },
                process.env.PRIVATE_KEY,
                { expiresIn: "1h" }
            );
            // שמירת הטוקן בסשן
            req.session.user = token;

           // הפניה לנתיב הראשי במקרה שהמשתמש הוא מנהל
           
if (myUser.isAdmin) {
  return res.redirect("/admin");
} else {
  // הפניה לדף "home" במקרה שהמשתמש אינו מנהל
  return res.render("home", { layout: "main", title: "home", username: myUser.fullName });
}

        }).catch((error) => {
            console.error("Error comparing passwords:", error);
            return res.status(500).json({ message: "Internal server error" });
        });
    }).catch((error) => {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Internal server error" });
    });
},
};
