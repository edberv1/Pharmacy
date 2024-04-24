const db = require("../db.js");

const adminController = (req, res) => {
  res.status(200).json({ message: "Admin route accessed." });
};

module.exports = {adminController};
