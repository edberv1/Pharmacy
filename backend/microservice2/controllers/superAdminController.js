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
    return res
      .status(400)
      .send("Firstname, lastname, email, and roleId are required");
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
  if (!role) {
    return res.status(400).send("Role required");
  }

  try {
    // Check if the role already exists
    const checkQuery = "SELECT * FROM roles WHERE role = ?";
    const checkResults = await db.query(checkQuery, [role]);

    if (checkResults.length > 0) {
      return res
        .status(400)
        .send("Role already exists. Please try another role.");
    }

    // Insert the new role
    const insertQuery = "INSERT INTO roles (role) VALUES (?)";
    const result = await db.query(insertQuery, [role]);

    res.send({
      message: "Role created successfully",
      roleId: result.insertId,
    });
  } catch (error) {
    // Handle database errors or other unexpected errors
    console.error("Error creating role:", error);
    return res.status(500).send("Internal server error");
  }
};

const editRole = async (req, res) => {
  const roleId = req.params.id;
  const { role } = req.body;

  // Perform validation
  if (!role) {
    return res.status(400).send("Role required");
  }

  // Check if the user with the given ID exists
  const checkQuery = "SELECT * FROM roles WHERE id = ?";

  db.query(checkQuery, [roleId], async (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Error executing MySQL query: ", checkErr);
      return res.status(500).send("Internal Server Error: " + checkErr.message);
    }

    // If user not found
    if (checkResults.length === 0) {
      return res.status(404).send("Role not found");
    }

    try {
      // Update the role details
      const updateQuery = `
        UPDATE roles 
        SET role = ?
        WHERE id = ?`;

      const queryParams = [role, roleId];

      await db.query(updateQuery, queryParams);

      res.send({ message: "Role updated successfully", roleId: roleId }); //userId: userId
    } catch (updateErr) {
      console.error("Error executing MySQL query: ", updateErr);
      res.status(500).send("Internal Server Error: " + updateErr.message);
    }
  });
};

const deleteRole = async (req, res) => {
  const roleId = req.params.id; // Assuming the user ID is passed as a route parameter

  // Check if the user exists
  const checkQuery = "SELECT * FROM roles WHERE id = ?";
  db.query(checkQuery, [roleId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Error executing MySQL query: ", checkErr);
      return res.status(500).send("Internal Server Error: " + checkErr.message);
    }

    if (checkResults.length === 0) {
      return res.status(404).send("Role not found");
    }

    // If the user exists, proceed with deletion
    const deleteQuery = "DELETE FROM roles WHERE id = ?";
    db.query(deleteQuery, [roleId], (deleteErr, result) => {
      if (deleteErr) {
        console.error("Error executing MySQL query: ", deleteErr);
        return res
          .status(500)
          .send("Internal Server Error: " + deleteErr.message);
      }
      res.send({ message: "Role deleted successfully" });
    });
  });
};

// =======================================PHARMACIES=======================================

const getAllPharmacies = async (req, res) => {
  const query = "SELECT * FROM pharmacies";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: ", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({ error: "No pharmacies found" });
    }
    res.json(results);
  });
};

const createPharmacy = async (req, res) => {
  const { name, location, userId } = req.body;

  // Perform validation
  if (!name || !location || !userId) {
    return res.status(400).send("All fields are required");
  }

  // Insert pharmacy
  const insertQuery =
    "INSERT INTO pharmacies (name, location, userId) VALUES (?, ?, ?)";
  db.query(
    insertQuery,
    [name, location, userId],
    (insertErr, result) => {
      if (insertErr) {
        console.error("Error executing MySQL query: ", insertErr);
        return res
          .status(500)
          .send("Internal Server Error: " + insertErr.message);
      }
      res.send({
        message: "Pharmacy created successfully",
        pharmacyId: result.insertId,
      });
    }
  );
};

const getAllUserIds = async (req, res) => {
  const query = "SELECT id, firstname FROM users";  // Fetching id and firstname

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: ", err);
      return res.status(500).send("Internal Server Error: " + err.message);
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    res.json(results);
  });
};

const editPharmacy = async (req, res) => {
  const pharmacyId = req.params.id;
  const { name , location } = req.body;

  // Perform validation
  if (!name || !location) {
    return res.status(400).send("Pharmacy required");
  }

  // Check if the user with the given ID exists
  const checkQuery = "SELECT * FROM pharmacies WHERE id = ?";

  db.query(checkQuery, [pharmacyId], async (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Error executing MySQL query: ", checkErr);
      return res.status(500).send("Internal Server Error: " + checkErr.message);
    }

    // If user not found
    if (checkResults.length === 0) {
      return res.status(404).send("Pharmacy not found");
    }

    try {
      // Update the pharmacy details
      const updateQuery = `
        UPDATE pharmacies 
        SET pharmacy = ?
        WHERE id = ?`;

      const queryParams = [pharmacy, pharmacyId];

      await db.query(updateQuery, queryParams);

      res.send({ message: "Pharmacy updated successfully", pharmacyId: pharmacyId }); //userId: userId
    } catch (updateErr) {
      console.error("Error executing MySQL query: ", updateErr);
      res.status(500).send("Internal Server Error: " + updateErr.message);
    }
  });
};

const deletePharmacy = async (req, res) => {
  const pharmacyId = req.params.id; // Assuming the user ID is passed as a route parameter

  // Check if the user exists
  const checkQuery = "SELECT * FROM pharmacies WHERE id = ?";
  db.query(checkQuery, [pharmacyId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Error executing MySQL query: ", checkErr);
      return res.status(500).send("Internal Server Error: " + checkErr.message);
    }

    if (checkResults.length === 0) {
      return res.status(404).send("Pharmacy not found");
    }

    // If the user exists, proceed with deletion
    const deleteQuery = "DELETE FROM pharmacies WHERE id = ?";
    db.query(deleteQuery, [pharmacyId], (deleteErr, result) => {
      if (deleteErr) {
        console.error("Error executing MySQL query: ", deleteErr);
        return res
          .status(500)
          .send("Internal Server Error: " + deleteErr.message);
      }
      res.send({ message: "Pharmacy deleted successfully" });
    });
  });
};


module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  editUser,
  getAllRoles,
  createRole,
  editRole,
  deleteRole,
  getAllPharmacies,
  createPharmacy,
  getAllUserIds,
  deletePharmacy,
  editPharmacy
};
