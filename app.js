require("dotenv").config(); // טוען את הקונפיגורציה מהקובץ .env
const express = require("express"); // ייבוא המודול express
const morgan = require("morgan"); // ייבוא המודול morgan
const mongoose = require("mongoose"); // ייבוא המודול mongoose
mongoose.pluralize(null); // הגדרת ייבוס לשמות הטבלאות
const MongoStore = require("connect-mongo"); // ייבוא המודול connect-mongo
const session = require("express-session"); // ייבוא המודול express-session
const hbs = require("express-handlebars"); // ייבוא המודול express-handlebars
const app = express(); // יצירת אפליקציה חדשה באמצעות express
const mysql = require("mysql"); // ייבוא המודול mysql
const geminiModel = require("./API/V1/models/gemini"); // ייבוא מודל gemini
const textRouter = require("./API/V1/routes/text_mongo"); // ייבוא נתיב text_mongo
const userRoute = require("./API/V1/routes/user"); // ייבוא נתיב user

const connection = mysql.createConnection({
  // יצירת חיבור למסד נתונים MySQL
  host: "127.0.0.1",
  user: "root",
  password: process.env.MYSQL_PRIVATE_PASS,
  database: "webai",
});
connection.connect(() => {
  // התחברות למסד נתונים MySQL
  console.log("Connected to MySQL");
});
global.db = connection; // הגדרת משתנה גלובלי עבור מסד הנתונים

const ConnStr = process.env.MONGO_CONN; // השמה של ערך מסד נתונים MongoDB
mongoose.connect(ConnStr + "webAI").then((status) => {
  // התחברות למסד נתונים MongoDB
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
app.use(express.urlencoded()); // פעולה עבור קבלת נתונים בפורמט URL-encoded

const twentyMin = 1000 * 60 * 20; // הגדרת זמן פג תוקף של ה-session
app.use(
  // השמת middleware של session
  session({
    secret: process.env.PRIVATE_KEY, // מפתח סודי להצפנה
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: twentyMin }, // הגדרת תקופת חיים ל-cookie
    store: MongoStore.create({
      // שמירת ה-session במסד נתונים MongoDB
      mongoUrl: process.env.MONGO_CONN + "SessionDb",
    }),
  })
);

app.get("/text", (req, res) => {
  // ניתוב GET לנתיב /text
  const text = require("./API/V1/models/text"); // יבוא מודל text
  text
    .find()
    .lean()
    .then((text) => {
      // שאילתת מסד נתונים לטקסט
      return res
        .status(200)
        .render("text", { layout: "main", title: "my texts", text }); // תצוגת טקסט
    });
});
app.get("/user", (req, res) => {
  // ניתוב GET לנתיב /user
  const Users = require("./API/V1/models/user"); // יבוא מודל user
  Users.find()
    .lean()
    .then((user) => {
      // שאילתת מסד נתונים למשתמש
      return res
        .status(200)
        .render("user", { layout: "main", title: "user", user }); // תצוגת משתמש
    });
});

app.get("/", (req, res) => {
  return res.status(200).render("home", { layout: "main", title: "Home" });
});

app.get("/register", (req, res) => {
  return res
    .status(200)
    .render("register", { layout: "main", title: "Register" });
});
app.get("/login", (req, res) => {
  return res.status(200).render("login", { layout: "main", title: "Login" });
});

app.use("/", textRouter); // שימוש ב-textRouter עבור הנתיב הראשי
app.use("/user", userRoute); // שימוש ב-userRoute עבור הנתיב /user

module.exports = app; // ייצוא של האפליקציה
