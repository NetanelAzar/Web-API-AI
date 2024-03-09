const mysql = require('mysql'); // משתנה לקריאת המודול mysql

const connection = mysql.createConnection({ // הגדרת חיבור לבסיס הנתונים
  host: 'localhost', // כתובת המארח
  user: 'your_username', // שם המשתמש להתחברות לבסיס הנתונים
  password: 'your_password', // סיסמת המשתמש להתחברות לבסיס הנתונים
  database: 'your_database' // שם הבסיס הנתונים
});

connection.connect((err) => { // פתיחת חיבור לבסיס הנתונים
  if (err) {
    console.error('Error connecting to database:', err); // במקרה של שגיאה בחיבור
    return;
  }
  console.log('Connected to MySQL database'); // במקרה של הצלחה בחיבור
});

module.exports = { // ייצוא הפונקציות המוגדרות
  getAllUsers: (req, res) => { // פונקציה לקבלת כל המשתמשים מהבסיס
    connection.query('SELECT * FROM users', (error, results, fields) => { // שאילתת SQL לקריאת כל המשתמשים
      if (error) {
        console.error("Error fetching users:", error); // במקרה של שגיאה בקריאת המשתמשים
        return res.status(500).json({ error: "An error occurred" });
      }
      console.log("Users fetched successfully"); // במקרה של הצלחה בקריאת המשתמשים
      return res.status(200).render("user", { layout: "main", title: "user", user: results });
    });
  },



  register: (req, res) => { // פונקציה לרישום משתמש חדש
    const { fullName, email, password, phone } = req.body; // קבלת פרטי המשתמש מהבקשה
    connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results, fields) => { // בדיקה אם האימייל כבר קיים במערכת
      if (error) {
        console.error("Error checking if email exists:", error); // במקרה של שגיאה בבדיקת האימייל
        return res.status(500).json({ error: "An error occurred" });
      }
      if (results.length > 0) { // אם האימייל כבר קיים במערכת
        return res.status(200).json({ message: "Email is already taken" });
      } else { // אם האימייל אינו קיים במערכת
        bcrypt.hash(password, 10, (err, hash) => { // הצפנת הסיסמה
          if (err) {
            console.error("Error hashing password:", err); // במקרה של שגיאה בהצפנת הסיסמה
            return res.status(500).json({ error: "An error occurred" });
          }
          connection.query('INSERT INTO users (fullName, email, password, phone) VALUES (?, ?, ?, ?)', [fullName, email, hash, phone], (error, results, fields) => { // הוספת המשתמש החדש לבסיס הנתונים
            if (error) {
              console.error("Error inserting user:", error); // במקרה של שגיאה בהוספת המשתמש
              return res.status(500).json({ error: "An error occurred" });
            }
            console.log("User inserted successfully"); // במקרה של הצלחה בהוספת המשתמש
            return res.status(200).render("login", { layout: "main", title: "Login" });
          });
        });
      }
    });
  },

  login: (req, res) => { // פונקציה להתחברות משתמש
    const { email, password } = req.body; // קבלת פרטי ההתחברות מהבקשה
    connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results, fields) => { // בדיקה אם המשתמש קיים במערכת
      if (error) {
        console.error("Error checking user:", error); // במקרה של שגיאה בבדיקת המשתמש
        return res.status(500).json({ error: "An error occurred" });
      }
      if (results.length === 0) { // אם המשתמש אינו קיים במערכת
        return res.status(200).json({ message: "Email or password not found" });
      }
      const hash = results[0].password; // שליפת הסיסמה המוצפנת של המשתמש מהתוצאות
      bcrypt.compare(password, hash, (err, result) => { // השוואת הסיסמה המוצפנת בבסיס הנתונים לסיסמה המוזנת
        if (err) {
          console.error("Error comparing passwords:", err); // במקרה של שגיאה בהשוואת הסיסמה
          return res.status(500).json({ error: "An error occurred" });
        }
        if (!result) { // אם הסיסמה אינה תואמת
          return res.status(200).json({ message: "Email or password not found" });
        }
        const token = jwt.sign( // יצירת טוקן למשתמש המחובר
          { email, password, fullName: results[0].fullName }, // פרטי המשתמש המוצפנים בטוקן
          process.env.PRIVATE_KEY, // המפתח הפרטי להצפנת הטוקן
          { expiresIn: "1h" } // זמן תוקף הטוקן
        );
        req.session.user = token; // הגדרת הטוקן בסשן
        return res.redirect("/text"); // החזרת תשובה עם העברה לדף הראשי למשתמש המחובר
      });
    });
  }
};
