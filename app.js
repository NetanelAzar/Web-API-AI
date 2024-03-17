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

const twentyMin = 1000 * 60 * 20; // הגדרת זמן פג תוקף של ה-session
// ייבוא נתיבי המשתמשים
const userRoute = require("./API/V1/routes/user");
const adminRoute =require("./API/V1/routes/admin")
const geminiRoute = require("./API/V1/routes/gemini");
const logINRoute = require("./API/V1/routes/logIn");
const registerRoute = require("./API/V1/routes/register");
const urlRoute = require("./API/V1/routes/url");
const homeRoute = require("./API/V1/routes/home");
const contactRoute = require("./API/V1/routes/contact")


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



app.use(
  session({// שימוש ב-session והגדרת הגדרות שונות עבורו
    secret: process.env.PRIVATE_KEY, 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: twentyMin }, 
    store: new MongoStore({  // אחסון sessions  ב- MongoDB
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





// שימוש בנתיבי ה-API
app.use("/contact",contactRoute );
app.use("/register", registerRoute);
app.use("/login", logINRoute);
app.use("/admin",adminRoute)
app.use("/text", geminiRoute);
app.use("/user", userRoute);
app.use("/url", urlRoute);
app.use("/",homeRoute);

module.exports = app; // ייצוא של האפליקציה
