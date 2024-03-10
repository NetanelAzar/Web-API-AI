require("dotenv").config(); // טוען את הקונפיגורציה מהקובץ .env
const express = require("express"); // ייבוא המודול express
const morgan = require("morgan"); // ייבוא המודול morgan
const session = require("express-session"); // ייבוא המודול express-session
const mongoose = require("mongoose"); // ייבוא המודול mongoose
mongoose.pluralize(null); // מונע מ-Mongoose להמיר את שמות הדגמים לשמות הקולקציות במסד הנתונים
const MongoStore = require("connect-mongo"); // ייבוא המודול connect-mongo
const multer=require('multer');
const mysql = require("mysql"); // ייבוא המודול mysql
const app = express(); // יצירת אפליקציה חדשה באמצעות express
const hbs = require("express-handlebars"); // ייבוא המודול express-handlebars

// ייבוא נתיבי המשתמשים
const userRoute = require("./API/V1/routes/user"); // ייבוא נתיב user
const geminiRoute = require("./API/V1/routes/gemini");
const logINRoute = require("./API/V1/routes/logIn");
const registerRoute = require("./API/V1/routes/register");
const urlRoute = require("./API/V1/routes/url");

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
app.use("/assets/", express.static("public")); // שימוש בקבצים סטטיים בנתיב /assets/

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








//יוצר שכבת ביניים

const storage=multer.diskStorage({//
  destination:(req,file,cb) => {
  if(file.fieldname=="picture"){
  
      cb(null,'uploads/pics/')
  }
   else if(file.fieldname=="video")
      cb(null,'uploads/video/');
      
  else
   cb(null,'uploads/documents/');
      
  },
  filename:(req,file,cb)=>{
      let filename=Math.floor(Math.random()*100000);
      let fileExtension=file.originalname.split('.').pop();
      cb(null,filename +"."+fileExtension)
  }
});



const uploadPics=multer({
  storage:storage
})



// המשתמש מועבר לכאן לאחר שהוא שולח את הטופס
app.post('/', uploadPics.single('picture'), (req, res) => {

console.log(req.body);
return res.status(200).json({msg:req.body});
});














// מסלול הבית
app.get("/home", (req, res) => {
  return res.status(200).render("home", { layout: "main", title: "Home" });
});
// מסלול הבית
app.get("/contact", (req, res) => {
  return res.status(200).render("contact", { layout: "main", title: "contact" });
});




const User = require("./API/V1/models/user"); // Importing the User model
app.get("/admin", (req, res) => {
    // Function to get all users
    User.find()
        .lean()
        .then((users) => {
            return res.status(200).render("admin", { layout: "main", title: "admin", users: users });
        })
        .catch((err) => {
            // Handle errors if any
            console.error(err);
            return res.status(500).send("Internal Server Error");
        });


    
});


// שימוש בנתיבי ה-API
app.use("/text", geminiRoute);
app.use("/login", logINRoute);
app.use("/register", registerRoute);
app.use("/user", userRoute);
app.use("/", urlRoute);

module.exports = app; // ייצוא של האפליקציה
