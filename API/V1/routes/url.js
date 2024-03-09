const express = require('express');
const routes = express.Router();
const Url = require('../models/urlModel');



routes.get('/url', async (req, res) => {
    try {
        const urls = await Url.find().lean();
        return res.status(200).render('shorturls', { layout: 'main', title: 'URL Shortener', urls });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

routes.post('/shorten', async (req, res) => {
    try {
      const url = new Url({ fullUrl: req.body.fullUrl });
      await url.save();
     return res.redirect('/url'); // שינוי לנתיב הראשי אחרי הקיצור
    } catch (error) {
      res.status(500).send('Invalid URL');
    }
});


routes.get('/:shortUrl', async (req, res) => {
    try {
        const shortUrl = req.params.shortUrl;
        const url = await Url.findOne({ shortUrl });
        if (!url) {
            return res.status(404).send('URL not found');
        }
        url.clicks++;
        await url.save();
        console.log(url.fullUrl);
        res.redirect(url.fullUrl);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});


module.exports = routes;
