const mongoose = require("mongoose");

mongoose.pluralize(null);

const qrCodeSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  githubLink: {
    type: String,
    required: true
  },
  qrCode: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("QRCode", qrCodeSchema);
