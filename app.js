require("dotenv").config(); // טוען את הקונפיגורציה מהקובץ .env
const express = require("express"); // ייבוא המודול express
const morgan = require("morgan"); // ייבוא המודול morgan
const session = require("express-session"); // ייבוא המודול express-session
const mongoose = require("mongoose"); // ייבוא המודול mongoose
mongoose.pluralize(null); // מונע מ-Mongoose להמיר את שמות הדגמים לשמות הקולקציות במסד הנתונים
const MongoStore = require("connect-mongo"); // ייבוא המודול connect-mongo
const mysql = require("mysql"); // ייבוא המודול mysql
const app = express(); // יצירת אפליקציה חדשה באמצעות express
const hbs = require("express-handlebars"); // ייבוא המודול express-handlebars

// ייבוא נתיבי המשתמשים
const userRoute = require("./API/V1/routes/user"); // ייבוא נתיב user
const geminiRoute = require("./API/V1/routes/gemini");
const logINRoute = require("./API/V1/routes/logIn");
const registerRoute = require("./API/V1/routes/register");
const urlRoute = require("./API/V1/routes/url");
const homeRoute = require("./API/V1/routes/home");

// יצירת חיבור למסד נתונים MySQL
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PRIVATE_PASS,
  database: process.env.MYSQL_DB,
});
connection.connect(() => {  // התחברות למסד נתונים MySQL
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


app.use(morgan("dev")); // שימוש ב-morgan עם פורמט "dev"
app.use(morgan("combined")); // שימוש ב-morgan עם פורמט "combined"
app.use(express.json()); // פעולה עבור קבלת JSON
app.use(express.urlencoded({ extended: true })); // פעולה עבור קבלת נתונים בפורמט URL-encoded

// הגדרת מנוע התצוגה של Handlebars
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultView: "index",
    layoutsDir: __dirname + "/views/layouts", // נתיב לתיקיית ה-layouts
    partialsDir: __dirname + "/views/partials", // נתיב לתיקיית ה-partials
  })
);

const twentyMin = 1000 * 60 * 20; // הגדרת זמן פג תוקף של ה-session

// שימוש ב-session והגדרת הגדרות שונות עבורו
app.use(
  session({
    secret: process.env.PRIVATE_KEY, 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: twentyMin }, 
    store: new MongoStore({  // storing sessions in MongoDB
      mongoUrl: process.env.MONGO_CONN + process.env.SESSION_DB,
    }),
  })
);

























var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

var mailOptions = {
  from:'netanelazar880@gmail.com' ,
  to: 'netanelazar880@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

































const User = require("./API/V1/models/user"); // 
const Text = require("./API/V1/models/text"); // 
const Url = require("./API/V1/models/urlModel"); // 
app.get("/admin", async (req, res) => {
  try {
    const text = await Text.find().lean();
    const url = await Url.find().lean();
      const users = await User.find().lean();
      return res.status(200).render("admin", { layout: "index", title: "admin", users,text,url });
  } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
  }

});
app.get("/text_admin", async (req, res) => {
  try {
    const text = await Text.find().lean();
    const url = await Url.find().lean();
      const users = await User.find().lean();
      return res.status(200).render("text_admin", { layout: "index", title: "admin", users,text,url });
  } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
  }

});
app.get("/shorturls", async (req, res) => {
  try {

    const urls = await Url.find().lean();
      
      return res.status(200).render("shorturls", { layout: "index", title: "admin", urls });
  } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
  }

});

// מסלול יצירת קשר
app.get("/contact", (req, res) => {
  return res.status(200).render("contact", { layout: "main", title: "contact", username: req.session.user });
});
// מסלול יצירת קשר
app.get("/users_admin", async (req, res) => {
  const users = await User.find().lean();
  return res.status(200).render("users_admin", { layout: "index", title: "admin", users });
});

app.get("/add_admin", async (req, res) => {
  const users = await User.find().lean();
  return res.status(200).render("add_admin", { layout: "index", title: "admin", users });
});


// שימוש בנתיבי ה-API
app.use("/text", geminiRoute);
app.use("/login", logINRoute);
app.use("/register", registerRoute);
app.use("/user", userRoute);
app.use("/url", urlRoute);
app.use("/", homeRoute);

module.exports = app; // ייצוא של האפליקציה
