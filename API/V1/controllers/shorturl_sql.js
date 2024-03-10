const mysql = require('mysql'); // יבוא הספריה של MySQL שישמשה ליצירת חיבור למסד הנתונים

const connection = global.db;


module.exports = {
  getUrl: (req, res) => { // פונקציה לקבלת רשימת כל ה-URLs ממסד הנתונים
    connection.query('SELECT * FROM urls', (error, results, fields) => { // שאילתת SQL להבאת כל ה-URLs
      if (error) {
        console.error("Error fetching URLs:", error); // במקרה של שגיאה בהבאת ה-URLs
        return res.status(500).send('Internal server error');
      }
      console.log("URLs fetched successfully"); // במקרה של הצלחה בהבאת ה-URLs
      return res.status(200).render('shorturls', { layout: 'main', title: 'URL Shortener', urls: results });
    });
  },

  addShorten: (req, res) => { // פונקציה להוספת URL חדש למסד הנתונים
    const { fullUrl } = req.body; // השגת ה-URL המלא מהבקשה
    connection.query('INSERT INTO urls (fullUrl) VALUES (?)', [fullUrl], (error, results, fields) => { // שאילתת SQL להוספת ה-URL למסד הנתונים
      if (error) {
        console.error("Error adding URL:", error); // במקרה של שגיאה בהוספת ה-URL
        return res.status(500).send('Invalid URL');
      }
      console.log("URL added successfully"); // במקרה של הצלחה בהוספת ה-URL
      return res.redirect('/url');
    });
  },

  getShortUrl: (req, res) => { // פונקציה לקבלת ה-URL המקוצר לפי ה-Short URL שלו
    const shortUrl = req.params.shortUrl; // השגת ה-Short URL מהבקשה
    connection.query('SELECT * FROM urls WHERE shortUrl = ?', [shortUrl], (error, results, fields) => { // שאילתת SQL להבאת ה-URL המקוצר ממסד הנתונים
      if (error) {
        console.error("Error fetching URL:", error); // במקרה של שגיאה בהבאת ה-URL
        return res.status(500).send('Internal server error');
      }
      if (results.length === 0) {
        return res.status(404).send('URL not found'); // במקרה של כשלון במציאת ה-URL
      }
      const url = results[0];
      connection.query('UPDATE urls SET clicks = clicks + 1 WHERE shortUrl = ?', [shortUrl], (error, results, fields) => { // שאילתת SQL לעדכון מספר הלחיצות על ה-URL
        if (error) {
          console.error("Error updating clicks count:", error); // במקרה של שגיאה בעדכון מספר הלחיצות
          return res.status(500).send('Internal server error');
        }
        console.log("Clicks count updated successfully"); // במקרה של הצלחה בעדכון מספר הלחיצות
        console.log(url.fullUrl);
        return res.redirect(url.fullUrl); // הפנייה ל-URL המקורי
      });
    });
  }
};
