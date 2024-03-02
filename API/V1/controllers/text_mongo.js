const text = require("../models/text"); // יבוא מודל text

module.exports = {
  getAllTexts: (req, res) => {
    // פונקציה לקבלת כל הטקסטים
    text.find().then((data) => {
      // מציאת כל המסמכים במודל text
      return res.status(200).json(data); // החזרת נתוני המסמך בפורמט JSON
    });
  },

  getTextById: (req, res) => {
    // פונקציה לקבלת מסמך לפי מזהה
    let Tid = req.params.id; // השגת מזהה מהבקשה
    text.findOne({ Tid }).then((data) => {
      // מציאת מסמך לפי המזהה
      return res.status(200).json(data); // החזרת המסמך בפורמט JSON
    });
  },

  updateText: (req, res) => {
    // פונקציה לעדכון מסמך
    let Tid = req.params.id; // השגת מזהה מהבקשה
    let body = req.body; // שינויים המתקבלים מהבקשה
    text.updateOne({ Tid }, body).then((data) => {
      // עדכון המסמך לפי המזהה
      return res.status(200).json(data); // החזרת נתונים על העדכון בפורמט JSON
    });
  },

  deleteText: (req, res) => {
    // פונקציה למחיקת מסמך
    let Tid = req.params.id; // השגת מזהה מהבקשה
    text.deleteOne({ Tid }).then((data) => {
      // מחיקת המסמך לפי המזהה
      return res.status(200).json(data); // החזרת נתונים על המחיקה בפורמט JSON
    });
  },
};
