// ייבוא המודול express ויצירת מופע של ראוטר
const routes = require("express").Router();
// ייבוא הקונטרולר לטקסט
const textController = require("../controllers/geminicontrollers")
// ייבוא middleware לאימות
const auth = require("../middlewares/auth");
const session = require("../middlewares/authSession");

// ייבוא פונקציות הקונטרולרים לטקסט מהקובץ text_mongo
const {
  getAllTexts,
  updateText,
  deleteText,
} = require("../controllers/text_mongo");

// הגדרת נתיב GET לקבלת כל הטקסטים
routes.get("/", getAllTexts);

// הגדרת נתיב POST להוספת טקסט חדש, עם middleware של auth ושימוש בפונקציה addText מהקונטרולר textController
routes.post("/api/text", textController.getText);

// הגדרת נתיב PATCH לעדכון טקסט קיים על פי ה-ID שמתקבל בפרמטר, שימוש בפונקציה updateText מהקונטרולר text_mongo
routes.patch("/:id", updateText);

// הגדרת נתיב DELETE למחיקת טקסט על פי ה-ID שמתקבל בפרמטר, שימוש בפונקציה deleteText מהקונטרולר text_mongo
routes.delete("/:id", deleteText);

// ייצוא הראוטר שהוגדר
module.exports = routes;
