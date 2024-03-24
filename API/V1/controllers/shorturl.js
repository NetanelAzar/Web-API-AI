const Url = require('../models/urlModel'); // יבוא המודל של ה-URL
const jwt = require('jsonwebtoken');
module.exports = {
    getUrl: async (req, res) => { 
        try {
            // פענוח הטוקן המוצפן ב-session על מנת לקבל את האימייל של המשתמש
            jwt.verify(req.session.user, process.env.PRIVATE_KEY, async (err, decoded) => {
                if (err) {
                    console.error(err);
                    return res.status(401).render("home", { layout: "main", title: "homer" });
                }
    
                const userEmail = decoded.email; // האימייל של המשתמש
                const fullName = decoded.fullName;
                // מציאת רשימת ה-URLs המשוייכים למשתמש המחובר
                const urls = await Url.find({ userEmail }).lean();
    
                // הצגת ה-URLs בתבנית התצוגה
                return res.status(200).render("shorturls", { 
                    layout: "main", 
                    title: "URL Shortener", 
                    urls, 
                    username: fullName, 
                    profileImage: req.session.profileImage 
                });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal server error');
        }
    },
    

    addShorten: async (req, res) => {
        try {
            // פענוח הטוקן המוצפן ב-session על מנת לקבל את שם המשתמש
            jwt.verify(req.session.user, process.env.PRIVATE_KEY, async (err, decoded) => {
                if (err) {
                    console.error(err);
                    return res.status(401).send("Failed to verify user token.");
                }
    
                const userEmail = decoded.email; // שמירת ה- userEmail מה-token
    
                const url = new Url({ 
                    fullUrl: req.body.fullUrl, 
                    userEmail: userEmail // שמירת ה- userEmail של המשתמש שיצר את ה-URL
                });
    
                await url.save(); // שמירת ה-URL בבסיס הנתונים
    
                return res.redirect('/url'); // החזרת המשתמש לדף הראשי אחרי הוספת ה-URL
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal server error');
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
