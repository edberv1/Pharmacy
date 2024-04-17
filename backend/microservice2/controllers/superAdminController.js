const User = require("../models/userModel");
const db = require("../db.js");
require("dotenv").config();

const getAllUsers = async (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: ", err);
      return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.json(results);
  });
};

const createUser = async (req, res) => {
  const { firstname, lastname, email, password, roleId } = req.body;

  // Perform validation
  if (!firstname || !lastname || !email || !password || !roleId) {
    return res.status(400).send("All fields are required");
  }

  // Check if the user with the same email already exists
  const checkQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkQuery, [email], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Error executing MySQL query: ", checkErr);
      return res.status(500).send("Internal Server Error: " + checkErr.message);
    }

    if (checkResults.length > 0) {
      return res.status(400).send("User with this email already exists");
    }

    // If the email is unique and roleId is valid, proceed with user creation
    const insertQuery = "INSERT INTO users (firstname, lastname, email, password, roleId) VALUES (?, ?, ?, ?, ?)";
    db.query(insertQuery, [firstname, lastname, email, password, roleId], (insertErr, result) => {
      if (insertErr) {
        console.error("Error executing MySQL query: ", insertErr);
        return res.status(500).send("Internal Server Error: " + insertErr.message);
      }
      res.send({ message: "User created successfully", userId: result.insertId });
    });
  });
};




module.exports = { getAllUsers, createUser };





