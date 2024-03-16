const multer = require('multer');

// יוצר שכבת ביניים להעלאת קבצים
const storage = multer.diskStorage({
  // הגדרת יעד לשמירת הקבצים המועלים
  destination: (req, file, cb) => {
    if (file.fieldname == "picture") {
      cb(null, 'public/uploads/pics/');
    } else if (file.fieldname == "video") {
      cb(null, 'public/uploads/pics/');
    } else {
      cb(null, 'public/uploads/pics/');
    }
  },
  // הגדרת שם קובץ חדש לפי רעיון רנדומלי
  filename: (req, file, cb) => {
    let filename = Math.floor(Math.random() * 100000); // יצירת שם רנדומלי
    let fileExtension = file.originalname.split('.').pop(); // קביעת סיומת הקובץ המקורית
    cb(null, filename + "." + fileExtension); // החזרת שם הקובץ החדש
  }
});

// יצירת middleware להעלאת קבצים בעזרת הגדרות האחסון שנקבעו
const uploadPics = multer({
  storage
});

module.exports = uploadPics;
