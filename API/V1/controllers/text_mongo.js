const text = require("../models/text");
module.exports = {
  getAllTexts: (req, res) => {
    text.find().then((data) => {
      return res.status(200).json(data);
    });
  },

  getTextById: (req, res) => {
    let Tid = req.params.id;
    text.findOne({ Tid }).then((data) => {
      return res.status(200).json(data);
    });
  },

  updateText: (req, res) => {
    let Tid = req.params.id;
    let body = req.body;
    text.updateOne({ Tid }, body).then((data) => {
      return res.status(200).json(data);
    });
  },

  deleteText: (req, res) => {
    let Tid = req.params.id;
    text.deleteOne({ Tid }).then((data) => {
      return res.status(200).json(data);
    });
  },
};
