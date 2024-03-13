const mongoose = require("mongoose"); // ייבוא המודול mongoose
mongoose.pluralize(null); // הגדרת ייבוס לשמות הטבלאות

const userSchema = new mongoose.Schema({
  // הגדרת סכמה עבור מודל המשתמש
  fullName: String, // שדה עבור השם המלא של המשתמש
  email: String, // שדה עבור האימייל של המשתמש
  pass: String, // שדה עבור הסיסמה של המשתמש
  phone: String, // שדה עבור מספר הטלפון של המשתמש
  picname: String, //
});

module.exports = mongoose.model("users", userSchema); // ייצוא המודל users עם הסכמה המתאימה
