const mysql = require("mysql");
module.exports = {
  // פונקציות
  addTextToDatabase: (text, req, res) => {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO text SET ?", text, (error, results, fields) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  },
};
