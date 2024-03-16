const mongoose = require('mongoose');
const shortId = require('shortid');

// הגדרת מבנה עבור הנתונים שאנחנו רוצים לאחסן במסד הנתונים
const urlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: shortId.generate, // יצירת קישור קצר באמצעות הספרייה shortid
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model('urls', urlSchema);
