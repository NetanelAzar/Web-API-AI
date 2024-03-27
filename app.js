require("dotenv").config(); // טוען את הקונפיגורציה מהקובץ .env
const express = require("express"); // ייבוא המודול express
const morgan = require("morgan"); // ייבוא המודול morgan
const mongoose = require("mongoose"); // ייבוא המודול mongoose
mongoose.pluralize(null); // מונע מ-Mongoose להמיר את שמות הדגמים לשמות הקולקציות במסד הנתונים
const { DateTime } = require("luxon");
const app = express(); // יצירת אפליקציה חדשה באמצעות express
const hbs = require("express-handlebars"); // ייבוא המודול express-handlebars

const sessionMiddleware = require('./API/V1/middlewares/sessionConfig');

// ייבוא נתיבי המשתמשים
const userRoute = require("./API/V1/routes/user");
const adminRoute =require("./API/V1/routes/admin")
const geminiRoute = require("./API/V1/routes/gemini");
const logINRoute = require("./API/V1/routes/logIn");
const registerRoute = require("./API/V1/routes/register");
const qrRoute=require("./API/V1/routes/qrcode");
const urlRoute = require("./API/V1/routes/url");
const homeRoute = require("./API/V1/routes/home");
const contactRoute = require("./API/V1/routes/contact")
const weatherRoutes=require('./API/V1/routes/weather');

const now = DateTime.now();// יצירת אובייקט DateTime עבור הזמן הנוכחי
const formattedDateTime = now.toFormat('yyyy-MM-dd HH:mm:ss');// קבלת התאריך והשעה בפורמט מבוקש (YYYY-MM-DD HH:MM:SS)
console.log(formattedDateTime);// הדפסת התאריך והשעה

/*
const connection = mysql.createConnection({// יצירת חיבור למסד נתונים MySQL
  host: "127.0.0.1",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PRIVATE_PASS,
  database: process.env.MYSQL_DB,
});
connection.connect(() => {  // התחברות למסד נתונים MySQL
  console.log("Connected to MySQL");
});
global.db = connection; // הגדרת משתנה גלובלי עבור מסד הנתונים
*/

const ConnStr = process.env.MONGO_CONN;
mongoose.connect(ConnStr + process.env.MONGO_DB).then((status) => {//התחברות למסד נתונים
  if (status) console.log("Connected to MongoDB");
  else console.log("Not Connected to MongoDB");
});

app.set("view engine", "hbs"); // הגדרת סוג קובץ התצוגה
app.use(express.static("public")); // שימוש בקבצים סטטיים בתיקיית public


app.use(morgan("dev")); // שימוש ב-morgan עם פורמט "dev"
app.use(morgan("combined")); // שימוש ב-morgan עם פורמט "combined"
app.use(express.json()); // פעולה עבור קבלת JSON
app.use(express.urlencoded({ extended: true })); // פעולה עבור קבלת נתונים בפורמט URL-encoded


app.engine(// הגדרת מנוע התצוגה של Handlebars
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultView: "index",
    layoutsDir: __dirname + "/views/layouts", // נתיב לתיקיית ה-layouts
    partialsDir: __dirname + "/views/partials", // נתיב לתיקיית ה-partials
  })
);

///קבלת סשן
app.use(sessionMiddleware);




// שימוש בנתיבי ה-API
app.use("/contact",contactRoute );
app.use("/register", registerRoute);
app.use("/weather",weatherRoutes)
app.use("/login", logINRoute);
app.use("/admin",adminRoute)
app.use("/text", geminiRoute);
app.use("/user", userRoute);
app.use("/url", urlRoute);
app.use("/qr", qrRoute);
app.use("/",homeRoute);




app.all("*", (req, res) => {
  res.status(404).send(`
    <html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="3; url=/">
  <title>{{title}}</title>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .content {
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="content">
    <h1>404 Not Found</h1>
    <p>The requested URL ${req.originalUrl} was not found on this server.</p>
    <p>Redirecting to <a href="/">Home Page</a> in 3 seconds...</p>
  </div>
</body>
</html>

  `);
});

module.exports = app; // ייצוא של האפליקציה
