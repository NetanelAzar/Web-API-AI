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
const geminiModel = require("./API/V1/models/gemini"); // ייבוא מודל gemini
const textRouter = require("./API/V1/routes/text_mongo"); // ייבוא נתיב text_mongo
const userRoute = require("./API/V1/routes/user"); // ייבוא נתיב user
const geminiRoute = require("./API/V1/routes/gemini");
const logINRoute = require("./API/V1/routes/logIn");


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
console.log(ConnStr);
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
    secret: process.env.PRIVATE_KEY, // secret key for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: twentyMin }, // setting cookie expiration time
    store: new MongoStore({
      // storing sessions in MongoDB
      mongoUrl: process.env.MONGO_CONN + process.env.SESSION_DB,
    }),
  })
);

/*app.get("/text", (req, res) => {
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
*/

app.get("/login", (req, res) => {
  return res.status(200).render("login", { layout: "main", title: "Login" });
});



// Login user 
/*app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  loginSc.find({ email }).then((results) => {
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
      return res.status(200).render("text",{ layout: "main", title: "Login" });
    });
  });
});
*/


app.use("/text", geminiRoute);
app.use("/login", logINRoute);


module.exports = app; // ייצוא של האפליקציה
