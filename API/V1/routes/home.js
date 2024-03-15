const routes = require("express").Router();
const axios = require('axios');
const cheerio = require('cheerio');

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

      res.render('home', { articles }); // השתמש בשם של המשתנה שלך בערך המקורי כאן
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
  }
});

  module.exports = routes;