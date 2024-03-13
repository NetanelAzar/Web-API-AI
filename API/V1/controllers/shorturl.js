const Url = require('../models/urlModel'); // יבוא המודל של ה-URL

module.exports = {

   getUrl: async (req, res) => { // פונקציה לקבלת רשימת כל ה-URLs
        try {
            const urls = await Url.find().lean(); // קריאה למודל ושליפת רשימת ה-URLs
            return res.status(200).render('shorturls', { layout: 'main', title: 'URL Shortener' ,urls }); // החזרת רשימת ה-URLs לתבנית צוברת
        } catch (error) {
            res.status(500).send('Internal server error'); // במקרה של שגיאה בשליפת הנתונים
        }
    },

   addShorten: async (req, res) => { // פונקציה להוספת קיצור URL חדש
        try {
          const url = new Url({ fullUrl: req.body.fullUrl }); // יצירת אובייקט ה-URL
          await url.save(); // שמירת ה-URL בבסיס הנתונים
         return res.redirect('/url'); // החזרת המשתמש לדף הראשי אחרי הוספת ה-URL
        } catch (error) {
          res.status(500).send('Invalid URL'); // במקרה של שגיאה בהוספת ה-URL
        }
    },

   getShortUrl: async (req, res) => { // פונקציה לקבלת URL קצר על פי הקיצור
        try {
            const shortUrl = req.params.shortUrl; // השגת הקיצור מהבקשה
            const url = await Url.findOne({ shortUrl }); // חיפוש ה-URL בבסיס הנתונים לפי הקיצור
            if (!url) { // במקרה שה-URL לא נמצא
                return res.status(404).send('URL not found');
            }
            url.clicks++; // עדכון מספר הקליקים
            await url.save(); // שמירת השינויים
            console.log(url.fullUrl);
            res.redirect(url.fullUrl); // הפניה ל-URL המלא
        } catch (error) {
            console.error(error); // במקרה של שגיאה בחיפוש ה-URL
            res.status(500).send('Internal server error');
        }
    }

};
