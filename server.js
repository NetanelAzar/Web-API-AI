// יבוא של המודול http שברשות Node.js
const http = require("http");

// יבוא של המודול app מהקובץ המצוי באותו תיקייה
const app = require("./app");

// השמת הפורט המוגדר בסביבת העבודה למשתנה port
const port = process.env.PORT;

// יצירת השרת על בסיס האפליקציה שנוצרה
const server = http.createServer(app);

// האזנה לחיבורים נכנסים והדפסת הודעה בעת עליית השרת
server.listen(port, () => {
  console.log("Server is running ");
});
