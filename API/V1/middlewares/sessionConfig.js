const session = require('express-session');
const MongoStore = require('connect-mongo');

const twentyMin = 20 * 60 * 1000; // 20 minutes in milliseconds

const sessionMiddleware = session({
  secret: process.env.PRIVATE_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: twentyMin },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_CONN + process.env.SESSION_DB,
  }),
});

module.exports = sessionMiddleware;
