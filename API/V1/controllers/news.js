const axios = require('axios');
const cheerio = require('cheerio');

module.exports={
    news: async (req, res) => { // הגדרת מסלול עבור הדף הראשי
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
          const fullName = req.user;
          return res.status(200).render("home", { layout: "main", title: "URL Shortener", articles,username: fullName }); // הצגת הדף הראשי עם 
        } catch (error) { // במקרה של שגיאה כללית
          console.error(error);
          res.status(500).send('An error occurred'); // החזרת הודעת שגיאה כללית
        }
      }
};
