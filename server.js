const http = require("http");// יבוא של המודול http שברשות Node.js


const app = require("./app");// יבוא של המודול app מהקובץ המצוי באותו תיקייה


const port = process.env.PORT;// השמת הפורט המוגדר בסביבת העבודה למשתנה port


const server = http.createServer(app);// יצירת השרת על בסיס האפליקציה שנוצרה


server.listen(port, () => {// האזנה לחיבורים נכנסים והדפסת הודעה בעת עליית השרת
  console.log("Server is running ");
});
