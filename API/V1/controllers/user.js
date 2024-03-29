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
    const { fullName, email, password, phone,isAdmin } = req.body; // שליפת פרטי המשתמש מהבקשה
    let picname;

    if (req.file) {
        picname = req.file.filename; // אם המשתמש העלה תמונה, נשתמש בה
    } else {
        picname = '9753.jpg'; // אם המשתמש לא העלה תמונה, נשתמש בתמונת ברירת המחדל
    }

    User.find({ email }).then((results) => {
      // בדיקה אם כבר קיים משתמש עם כתובת האימייל
      if (results.length > 0) {
        // אם קיים משתמש עם כתובת האימייל
        return res.status(200).render("register", { layout: "main", title: "Register", error: "Email is already taken" }); // החזרת הודעת שגיאה
      } else {
        // אם אין משתמש עם כתובת האימייל
        bcrypt.hash(password, 10).then((hashPass) => {

          // הצפנת הסיסמה
          User.insertMany({
            // הוספת המשתמש החדש למודל user
            fullName,
            email,
            password: hashPass,
            phone,
            picname,
            isAdmin,
           /// picname,
          }).then((results) => {
            // שליחת איימיל למשתמש שנרשם
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: email,
              subject: 'Welcome to our website!',
              html: `
                <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
                  <h2 style="color: #333;">Thank you for registering with us!</h2>
                  <p style="color: #666;">We are excited to have you on board.</p>
                  <a href="https://www.yourwebsite.com" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit our website</a>
                </div>
              `
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
    const { email, password } = req.body;

    // בדיקה אם האימייל והסיסמה נשלחו בבקשה
    if (!email || !password) {
        return res.status(400).render('login', { error: "Email and password are required"});
    }

    logIn.find({ email }).then((results) => {
        // אם לא נמצאו תוצאות עבור האימייל
        if (results.length === 0) {
          return res.status(404).render('login', { error: "Email or password incorrect" });
        }

        const hashPass = results[0].password;

        // בדיקה אם לא נמצאה סיסמה מוצפנת בבסיס הנתונים
        if (!hashPass || hashPass.length === 0) {
            return res.status(500).json({ message: "Hashed password not found in database" });
        }

        // השוואת הסיסמה הקלה לסיסמה המוצפנת
        bcrypt.compare(password, hashPass).then((status) => {
            if (!status) {
              return res.status(401).render('login', { error: "Email or password incorrect" });
            }

            // אם הכל תקין - יצירת טוקן ושליפת התמונה
            const myUser = results[0];
            const token = jwt.sign(
                { email, password, fullName: myUser.fullName},
                process.env.PRIVATE_KEY,
                { expiresIn: "1h" }
            );

            // שמירת הטוקן בסשן
            req.session.user = token;

            // כאן אני יודע אם המשתמש הוא admin
            const isAdmin = myUser.isAdmin;

            if (isAdmin) {

              User.findOne({ email }).then((user) => {
                // הפניה לתבנית ה-HTML עם התמונה
                return res.render("Welcome", {
                    layout: "main",
                    title: "Welcome",
                    username: myUser.fullName,
                    profileImage: `/uploads/pics/${user.picname}`, // כתובת ה-URL של התמונה
                    isAdmin: isAdmin
                });
            }).catch((error) => {
                console.error("Error fetching user data:", error);
                return res.status(500).json({ message: "Internal server error" });
            });
              // המשתמש הוא admin, שלח אותו ישירות לדף ה-admin
          }
           else {
                // אם המשתמש אינו admin, המשך עם הלוגיקה הרגילה
                User.findOne({ email }).then((user) => {
                    // הפניה לתבנית ה-HTML עם התמונה
                    return res.render("Welcome", {
                        layout: "main",
                        title: "Welcome",
                        username: myUser.fullName,
                        profileImage: `/uploads/pics/${user.picname}` // כתובת ה-URL של התמונה
                    });
                }).catch((error) => {
                    console.error("Error fetching user data:", error);
                    return res.status(500).json({ message: "Internal server error" });
                });
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


logOut:(req, res) => {
  req.session.destroy((err) => {// נקיה של הנתונים המזוהים עם המשתמש המחובר מהמאפיין `req.session`.
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Internal Server Error");
    }
    // הפניה אל דף ההתחברות (login page) או דף אחר בו המשתמש יכול להתחבר מחדש.
    res.redirect("/login"); // דוגמה לפנייה אל דף ההתחברות
  });
},

};
