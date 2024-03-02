const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = {
  getAllUsers: (req, res) => {
    User.find().then((data) => {
      return res.status(200).json(data);
    });
  },

  getUserById: (req, res) => {
    let userId = req.params.id;
    User.findOne({ userId }).then((data) => {
      return res.status(200).json(data);
    });
  },

  addUser: (req, res) => {
    let body = req.body;
    User.insertMany([body]).then((data) => {
      return res.status(200).json(data);
    });
  },

  updateUser: (req, res) => {
    let body = req.body;
    let userId = req.params.id;
    User.updateOne({ userId }, body).then((data) => {
      return res.status(200).json(data);
    });
  },
  deleteUser: (req, res) => {
    let userId = req.params.id;
    User.deleteOne({ userId }).then((data) => {
      return res.status(200).json(data);
    });
  },

  register: (req, res) => {
    const { userId, fullName, email, pass, phone } = req.body;
    User.find({ email }).then((results) => {
      if (results.length > 0) {
        return res.status(200).json({ message: "Email is already taken" });
      } else {
        bcrypt.hash(pass, 10).then((hashPass) => {
          User.insertMany({
            userId,
            fullName,
            email,
            pass: hashPass,
            phone,
          }).then((results) => {
            return res.status(200).json(results);
          });
        });
      }
    });
  },

  login: (req, res) => {
    const { email, pass } = req.body;
    User.find({ email }).then((results) => {
      if (results.length == 0)
        return res.status(200).json({ message: "Email or Pass not found" });

      const hashPass = results[0].pass;
      bcrypt.compare(pass, hashPass).then((status) => {
        if (!status)
          return res.status(200).json({ message: "Email or Pass not found" });

        const myUser = results[0];
        const token = jwt.sign(
          { email, pass, fullName: myUser.fullName },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "1h",
          }
        );
        req.session.user = token;
        return res
          .status(200)
          .json({ message: "user login successfully", token });
      });
    });
  },
};
