const mongoose = require("mongoose"); // ייבוא המודול mongoose
mongoose.pluralize(null); // הגדרת ייבוס לשמות הטבלאות

const Schema = mongoose.Schema({
  // הגדרת סכמה עבור מודל הטקסט
  Tid: Number, // שדה עבור מזהה הטקסט
  prompt: String, // שדה עבור הפרסום
  answer: String, // שדה עבור התשובה
  created_at: { type: Date, default: Date.now }, // שדה עבור זמן יצירה
  updated_at: { type: Date, default: Date.now }, // שדה עבור זמן עדכון
});

module.exports = mongoose.model("text", Schema); // ייצוא המודל text עם הסכמה המתאימה
