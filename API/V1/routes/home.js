const routes = require("express").Router();
const axios = require('axios');
const cheerio = require('cheerio');
const jwt = require('jsonwebtoken');

// מסלול הבית
routes.get("/", async (req, res) => { // הגדרת מסלול עבור הדף הראשי
  try {
    const articles = []; // מערך ריק לאחסון המאמרים
    const websiteUrl = 'https://www.now14.co.il/'; // כתובת האתר שממנו יש לקבל את המאמרים

    const response = await axios.get(websiteUrl); // שליפת התוכן של האתר
    const html = response.data; // קבלת תוכן ה-HTML
    const $ = cheerio.load(html); // טעינת ה-HTML לספרייה של Cheerio

    $('.mibzak-unit').each(function() { // עבור על כל אלמנט מסוג .mibzak-unit בתוך ה-HTML
      const title = $(this).find('a').text().trim(); // קבלת הטקסט של הקישור בתוך האלמנט והסרת רווחים מתחילתו ומסופו
      const link = $(this).find('a').attr('href'); // קבלת הקישור של האלמנט

      articles.push({ // הוספת הכותרת והקישור של המאמר למערך המאמרים
        title,
        link
      });
    });

    // פענוח הטוקן המוצפן ב-session על מנת לקבל את שם המשתמש
    jwt.verify(req.session.user, process.env.PRIVATE_KEY, (err, decoded) => {
      if (err) { // במקרה של שגיאה בפענוח הטוקן
        console.error(err);
        return res.status(401).render("home", { layout: "main", title: "home" }); // תחזיר דף אימות שגיאה
      } else {
        // אם הפענוח הצליח, מידע המזוהה עם המשתמש מוצג בתבנית התצוגה "home"
        const fullName = decoded.fullName; // שם המשתמש המלא
        return res.status(200).render("home", { layout: "main", title: "URL Shortener", articles, username: fullName }); // הצגת הדף הראשי עם המאמרים ושם המשתמש
      }
    });
  } catch (error) { // במקרה של שגיאה כללית
    console.error(error);
    res.status(500).send('An error occurred'); // החזרת הודעת שגיאה כללית
  }
});

module.exports = routes; // ייצוא המודול
