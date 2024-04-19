const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const db = require("../db.js");
require("dotenv").config();


// =======================================USERS=======================================

const getAllUsers = async (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: ", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
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

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

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
    const insertQuery =
      "INSERT INTO users (firstname, lastname, email, password, roleId) VALUES (?, ?, ?, ?, ?)";
    db.query(
      insertQuery,
      [firstname, lastname, email, hashedPassword, roleId],
      (insertErr, result) => {
        if (insertErr) {
          console.error("Error executing MySQL query: ", insertErr);
          return res
            .status(500)
            .send("Internal Server Error: " + insertErr.message);
        }
        res.send({
          message: "User created successfully",
          userId: result.insertId,
        });
      }
    );
  });
};

const deleteUser = async (req, res) => {
  const userId = req.params.id; // Assuming the user ID is passed as a route parameter

  // Check if the user exists
  const checkQuery = "SELECT * FROM users WHERE id = ?";
  db.query(checkQuery, [userId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Error executing MySQL query: ", checkErr);
      return res.status(500).send("Internal Server Error: " + checkErr.message);
    }

    if (checkResults.length === 0) {
      return res.status(404).send("User not found");
    }

    // If the user exists, proceed with deletion
    const deleteQuery = "DELETE FROM users WHERE id = ?";
    db.query(deleteQuery, [userId], (deleteErr, result) => {
      if (deleteErr) {
        console.error("Error executing MySQL query: ", deleteErr);
        return res
          .status(500)
          .send("Internal Server Error: " + deleteErr.message);
      }
      res.send({ message: "User deleted successfully" });
    });
  });
};

const editUser = async (req, res) => {
  const userId = req.params.id;
  const { firstname, lastname, email, roleId } = req.body;

  // Perform validation
  if (!firstname || !lastname || !email || !roleId) {
    return res.status(400).send("Firstname, lastname, email, and roleId are required");
  }

  // Check if the user with the given ID exists
  const checkQuery = "SELECT * FROM users WHERE id = ?";
  
  db.query(checkQuery, [userId], async (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Error executing MySQL query: ", checkErr);
      return res.status(500).send("Internal Server Error: " + checkErr.message);
    }

    // If user not found
    if (checkResults.length === 0) {
      return res.status(404).send("User not found");
    }

    try {
      // Update the user details
      const updateQuery = `
        UPDATE users 
        SET firstname = ?, lastname = ?, email = ?, roleId = ? 
        WHERE id = ?`;

      const queryParams = [firstname, lastname, email, roleId, userId];

      await db.query(updateQuery, queryParams);

      res.send({ message: "User updated successfully", userId: userId });
    } catch (updateErr) {
      console.error("Error executing MySQL query: ", updateErr);
      res.status(500).send("Internal Server Error: " + updateErr.message);
    }
  });
};


// =======================================ROLES=======================================

const getAllRoles = async (req, res) => {
  const query = "SELECT * FROM roles";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: ", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({ error: "No roles found" });
    }
    res.json(results);
  });
};

const createRole = async (req, res) => {
  const { role } = req.body;

  // Perform validation
  if (role) {
    return res.status(400).send("All fields are required");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

  // Check if the user with the same email already exists
  const checkQuery = "SELECT * FROM roles WHERE id = ?";
  db.query(checkQuery, [role], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Error executing MySQL query: ", checkErr);
      return res.status(500).send("Internal Server Error: " + checkErr.message);
    }

    if (checkResults.length > 0) {
      return res.status(400).send("Role already exists");
    }

    // If the email is unique and roleId is valid, proceed with user creation
    const insertQuery =
      "INSERT INTO roles (role) VALUES (?)";
    db.query(
      insertQuery,
      [role],
      (insertErr, result) => {
        if (insertErr) {
          console.error("Error executing MySQL query: ", insertErr);
          return res
            .status(500)
            .send("Internal Server Error: " + insertErr.message);
        }
        res.send({
          message: "User created successfully",
          roleId: result.insertId,
        });
      }
    );
  });
};


module.exports = { getAllUsers, createUser, deleteUser, editUser, getAllRoles, createRole };
