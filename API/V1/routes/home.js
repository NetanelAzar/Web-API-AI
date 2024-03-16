const routes = require("express").Router();
const axios = require('axios');
const cheerio = require('cheerio');
const jwt = require('jsonwebtoken');
// מסלול הבית
routes.get("/", async (req, res) => {///כתבות חדשות 14
  try {
      const articles = [];
      const websiteUrl = 'https://www.now14.co.il/';

      const response = await axios.get(websiteUrl);
      const html = response.data;
      const $ = cheerio.load(html);

      $('.mibzak-unit').each(function() {
          const title = $(this).find('a').text().trim();
          const link = $(this).find('a').attr('href');

          articles.push({
              title,
              link
          });
      });

          // פענוח הטוקן המוצפן ב-session על מנת לקבל את שם המשתמש
          jwt.verify(req.session.user, process.env.PRIVATE_KEY, (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).render("home", { layout: "main", title: "home" });
            } else {
                // אם הפענוח הצליח, מידע המזוהה עם המשתמש מוצג בתבנית התצוגה "shorturls"
                const fullName = decoded.fullName;
                return res.status(200).render("home", { layout: "main", title: "URL Shortener", articles, username: fullName });
            }
        });
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
  }
});

  module.exports = routes;



  
      