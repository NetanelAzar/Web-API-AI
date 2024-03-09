require("dotenv").config(); // טוען את הקונפיגורציה מהקובץ .env
const express = require("express"); // ייבוא המודול express
const morgan = require("morgan"); // ייבוא המודול morgan
const session = require("express-session"); // ייבוא המודול express-session
const mongoose = require("mongoose"); // ייבוא המודול mongoose
mongoose.pluralize(null); // מונע מ-Mongoose להמיר את שמות הדגמים לשמות הקולקציות במסד הנתונים
const MongoStore = require("connect-mongo"); // ייבוא המודול connect-mongo
const hbs = require("express-handlebars"); // ייבוא המודול express-handlebars
const app = express(); // יצירת אפליקציה חדשה באמצעות express
const mysql = require("mysql"); // ייבוא המודול mysql
const userRoute = require("./API/V1/routes/user"); // ייבוא נתיב user
const geminiRoute = require("./API/V1/routes/gemini");
const logINRoute = require("./API/V1/routes/logIn");
const registerRoute = require("./API/V1/routes/register");



const connection = mysql.createConnection({
  // יצירת חיבור למסד נתונים MySQL
  host: "127.0.0.1",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PRIVATE_PASS,
  database: process.env.MYSQL_DB,
});
connection.connect(() => {
  // התחברות למסד נתונים MySQL
  console.log("Connected to MySQL");
});
global.db = connection; // הגדרת משתנה גלובלי עבור מסד הנתונים

//התחברות למסד נתונים
const ConnStr = process.env.MONGO_CONN;
mongoose.connect(ConnStr + process.env.MONGO_DB).then((status) => {
  if (status) console.log("Connected to MongoDB");
  else console.log("Not Connected to MongoDB");
});

app.set("view engine", "hbs"); // הגדרת סוג קובץ התצוגה

app.use(express.static("public")); // שימוש בקבצים סטטיים בתיקיית public
app.use("/assets/", express.static("public")); // שימוש בקבצים סטטיים בנתיב /assets/

app.engine(
  // הגדרת מנוע התצוגה של Handlebars
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultView: "index",
    layoutsDir: __dirname + "/views/layouts", // נתיב לתיקיית ה-layouts
    partialsDir: __dirname + "/views/partials", // נתיב לתיקיית ה-partials
  })
);
app.use(morgan("dev")); // שימוש ב-morgan עם פורמט "dev"
app.use(morgan("combined")); // שימוש ב-morgan עם פורמט "combined"
app.use(express.json()); // פעולה עבור קבלת JSON
app.use(express.urlencoded({ extended: true })); // פעולה עבור קבלת נתונים בפורמט URL-encoded

const twentyMin = 1000 * 60 * 20; // הגדרת זמן פג תוקף של ה-session
app.use(
  session({
    secret: process.env.PRIVATE_KEY, 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: twentyMin }, 
    store: new MongoStore({
      // storing sessions in MongoDB
      mongoUrl: process.env.MONGO_CONN + process.env.SESSION_DB,
    }),
  })
);



app.get("/home", (req, res) => {
  return res.status(200).render("home", { layout: "main", title: "Home" });
});


app.use("/text", geminiRoute);
app.use("/login", logINRoute);
app.use("/register", registerRoute);
app.use("/user", userRoute);





module.exports = app; // ייצוא של האפליקציה
