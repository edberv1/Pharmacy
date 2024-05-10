const db = require("../db.js");
const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');

const getUserProfile = (req, res) => {
  const userId = req.userId; // assuming the userId is set in the request

  User.getUserById(userId, function(err, user) {
    if (err) {
      res.status(500).send({ message: 'Database error.' });
    } else if (!user) {
      res.status(404).send({ message: 'User not found.' });
    } else {
      res.status(200).send(user);
    }
  });
};

const updateUserProfile = (req, res) => {
    const { firstName, lastName } = req.body;

  // SQL query to update the user profile
  const sql = `UPDATE users SET firstname = ?, lastname = ?`;

  // Execute the query
  db.query(sql, [firstName, lastName], (err, result) => {
    if (err) {
      console.error('Error updating user profile: ', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      res.status(200).json({ message: 'User profile updated successfully' });
    }
  });
  };
 
  const changePassword = (req, res) => {
    const { currentPassword, newPassword } = req.body;
  
    User.getUserById(req.userId, function(err, user) {
      if (err) {
        res.status(500).send({ message: 'Database error.' });
      } else if (!user) {
        res.status(404).send({ message: 'User not found.' });
      } else {
        // Check if the current password is correct
        if (bcrypt.compareSync(currentPassword, user[0].password)) { // Change this line
          // Hash the new password
          const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
  
          // SQL query to update the user password
          const sql = `UPDATE users SET password = ? WHERE id = ?`;
  
          // Execute the query
          db.query(sql, [hashedNewPassword, req.userId], (err, result) => {
            if (err) {
              console.error('Error updating user password: ', err);
              res.status(500).json({ message: 'Server error' });
            } else {
              res.status(200).json({ message: 'Password updated successfully' });
            }
          });
        } else {
          res.status(403).json({ message: 'Current password is incorrect.' });
        }
      }
    });
  };
  
  //==================================== PRODUCTS ===============================//

  // const getAllProducts = async (req, res) => {
  //   const query = "SELECT * FROM products";
  //   db.query(query, (err, results) => {
  //     if (err) {
  //       console.error("Error executing MySQL query: ", err);
  //       return res
  //         .status(500)
  //         .json({ error: "Internal Server Error", details: err.message });
  //     }
  //     if (!results || results.length === 0) {
  //       return res.status(404).json({ error: "No products found" });
  //     }
  //     res.json(results);
  //   });
  // };

  const getAllProducts = async (req, res) => {
    const userId = req.userId; // Assuming you have userId in the request
    const query = "SELECT * FROM products WHERE pharmacyId IN (SELECT id FROM pharmacies WHERE userId = ?)";
    db.query(query, userId, (err, results) => {
      if (err) {
        console.error("Error executing MySQL query: ", err);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      }
      if (!results || results.length === 0) {
        return res.status(404).json({ error: "No products found" });
      }
      res.json(results);
    });
  };

  const getPharmaciesForUser = async (req, res) => {
    const userId = req.userId; // Assuming you have userId in the request
    const query = "SELECT * FROM pharmacies WHERE userId = ?";
    db.query(query, userId, (err, results) => {
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
  

  const createProduct = async (req, res) => {
    const { name, produced, pharmacyId, stock } = req.body;
  
    // Perform validation
    if (!name || !produced || !pharmacyId || !stock) {
      return res.status(400).send("All fields are required");
    }
  
    // Insert pharmacy
    const insertQuery =
      "INSERT INTO products (name, produced, pharmacyId, stock) VALUES (?, ?, ?, ?)";
    db.query(insertQuery, [name, produced, pharmacyId, stock], (insertErr, result) => {
      if (insertErr) {
        console.error("Error executing MySQL query: ", insertErr);
        return res
          .status(500)
          .send("Internal Server Error: " + insertErr.message);
      }
      res.send({
        message: "Product created successfully",
        pharmacyId: result.insertId,
      });
    });
  };

  const editProduct = async (req, res) => {
    const productId = req.params.id;
    const { name, produced, pharmacyId, stock } = req.body;
  
    try {
      // Update the product details
      const updateQuery = `
        UPDATE products 
        SET name = ?, produced = ?, pharmacyId = ?, stock = ?
        WHERE id = ?`;
  
      const queryParams = [name, produced, pharmacyId, stock, productId];
  
      await db.query(updateQuery, queryParams);
  
      res.send({ message: "Product updated successfully", productId: productId });
    } catch (updateErr) {
      console.error("Error updating product: ", updateErr);
      res.status(500).send("Internal Server Error: " + updateErr.message);
    }
  };

  const deleteProduct = async (req, res) => {
    const productId = req.params.id; // Assuming the user ID is passed as a route parameter
  
    // Check if the user exists
    const checkQuery = "SELECT * FROM products WHERE id = ?";
    db.query(checkQuery, [productId], (checkErr, checkResults) => {
      if (checkErr) {
        console.error("Error executing MySQL query: ", checkErr);
        return res.status(500).send("Internal Server Error: " + checkErr.message);
      }
  
      if (checkResults.length === 0) {
        return res.status(404).send("Pharmacy not found");
      }
  
      // If the user exists, proceed with deletion
      const deleteQuery = "DELETE FROM products WHERE id = ?";
      db.query(deleteQuery, [productId], (deleteErr, result) => {
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

module.exports = {getUserProfile, updateUserProfile, changePassword, getAllProducts, getPharmaciesForUser, createProduct, editProduct, deleteProduct};
