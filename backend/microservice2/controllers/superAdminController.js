const User = require("../models/userModel");
const db = require("../db.js");
require("dotenv").config();

const getAllUsers = async (req, res) => {
  const query = "SELECT * FROM users";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: " + err.stack);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
};

module.exports = { getAllUsers };
