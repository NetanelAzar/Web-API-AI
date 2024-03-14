
const jwt = require("jsonwebtoken");

// Middleware function for token verification
const verifyTokenMiddleware = (req, res, next) => {
    // פענוח הטוקן המוצפן ב-session על מנת לקבל את שם המשתמש
    jwt.verify(req.session.user, process.env.PRIVATE_KEY, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).render("login", { layout: "main", title: "login" });
        } else {
            // אם הפענוח הצליח, מידע המזוהה עם המשתמש מוצג בתבנית התצוגה "shorturls"
            const fullName = decoded.fullName;
            req.user = fullName; // הוספת המשתמש לאובייקט הבקשה לשימוש בקוד הבא
            next();
        }
    });
};

module.exports = verifyTokenMiddleware;
