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

  //============================================ADMIN PHARMACIES METHODS==============================

const getPharmacyById = async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch pharmacy details from the database based on the id
    const query = "SELECT * FROM pharmacies WHERE id = ?"; 
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error fetching pharmacy details:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!results || results.length === 0) {
        return res.status(404).json({ error: 'Pharmacy not found' });
      }
      res.json(results[0]); // Send the first result (assuming id is unique)
    });
  } catch (error) {
    console.error('Error fetching pharmacy details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPharmacyProducts = async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch products associated with the pharmacy ID from the database
    const query = "SELECT * FROM products WHERE pharmacyId = ?"; 
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!results || results.length === 0) {
        return res.status(404).json({ error: 'Products not found for this pharmacy' });
      }
      res.json(results); // Send the products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createPharmacy = async (req, res) => {
  const { name, location } = req.body;
  const userId = req.userId; // Assuming you have userId in the request

  // Perform validation
  if (!name || !location) {
    return res.status(400).send("Name and location are required");
  }

  // Insert pharmacy
  const insertQuery =
    "INSERT INTO pharmacies (name, location, userId) VALUES (?, ?, ?)";
  db.query(insertQuery, [name, location, userId], (insertErr, result) => {
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
  });
};



module.exports = {getUserProfile, updateUserProfile, changePassword, getAllProducts, getPharmaciesForUser, createProduct, editProduct, deleteProduct , getPharmacyById, getPharmacyProducts, createPharmacy};
