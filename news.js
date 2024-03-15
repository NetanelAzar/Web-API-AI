const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 8080;

app.get('/news', async (req, res) => {
    try {
        const articles = [];
        const websiteUrl = 'https://www.now14.co.il/';

        const response = await axios.get(websiteUrl);
        const html = response.data;
        const $ = cheerio.load(html);

        $('.mibzak-unit').each(function() {
            const title = $(this).find('a').text().trim();

            articles.push({
                title,
            });
        });

        res.json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
