const db = require("../db.js");
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");

const getUserProfile = (req, res) => {
  const userId = req.user.id; // assuming the userId is set in the request

  User.getUserById(userId, function (err, user) {
    if (err) {
      res.status(500).send({ message: "Database error." });
    } else if (!user) {
      res.status(404).send({ message: "User not found." });
    } else {
      res.status(200).send(user);
    }
  });
};

const updateUserProfile = (req, res) => {
  const { firstName, lastName } = req.body; // Assuming you're sending userId in the request body
  const userId = req.user.id;
  // SQL query to update the user profile
  const sql = `UPDATE users SET firstname = ?, lastname = ? WHERE id = ?`; // Add WHERE clause here

  // Execute the query
  db.query(sql, [firstName, lastName, userId], (err, result) => {
    // Add userId here
    if (err) {
      console.error("Error updating user profile: ", err);
      res.status(500).json({ message: "Server error" });
    } else {
      res.status(200).json({ message: "User profile updated successfully" });
    }
  });
};

const changePassword = (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  User.getUserById(userId, function (err, user) {
    if (err) {
      res.status(500).send({ message: "Database error." });
    } else if (!user) {
      res.status(404).send({ message: "User not found." });
    } else {
      // Check if the current password is correct
      if (bcrypt.compareSync(currentPassword, user[0].password)) {
        // Change this line
        // Hash the new password
        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

        // SQL query to update the user password
        const sql = `UPDATE users SET password = ? WHERE id = ?`;

        // Execute the query
        db.query(sql, [hashedNewPassword, userId], (err, result) => {
          if (err) {
            console.error("Error updating user password: ", err);
            res.status(500).json({ message: "Server error" });
          } else {
            res.status(200).json({ message: "Password updated successfully" });
          }
        });
      } else {
        res.status(403).json({ message: "Current password is incorrect." });
      }
    }
  });
};

//==================================== PRODUCTS ===============================//

const getAllProducts = async (req, res) => {
  const userId = req.userId; // Assuming you have userId in the request
  const query =
    "SELECT * FROM products WHERE pharmacyId IN (SELECT id FROM pharmacies WHERE userId = ?)";
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
  const userId = req.user.id; // Assuming you have userId in the request
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
  console.log("Received request to create product...");
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);

  const { name, description, produced, price, pharmacyId, stock } = req.body;

  if (!req.file) {
    return res.status(400).send("No file was uploaded");
  }

  const image = req.file.path;

  // Perform validation
  if (!name || !description || !produced || !price || !pharmacyId || !stock) {
    return res.status(400).send("All fields are required");
  }

  // Insert pharmacy
  const insertQuery =
    "INSERT INTO products (name, description, produced, price, pharmacyId, stock, image) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    insertQuery,
    [name, description, produced, price, pharmacyId, stock, image],
    (insertErr, result) => {
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
    }
  );
};

const editProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, produced, price, pharmacyId, stock } = req.body;

  try {
    // Update the product details
    const updateQuery = `
        UPDATE products 
        SET name = ?, description=?, produced = ?, price=?, pharmacyId = ?, stock = ?
        WHERE id = ?`;

    const queryParams = [
      name,
      description,
      produced,
      price,
      pharmacyId,
      stock,
      productId,
    ];

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
        console.error("Error fetching pharmacy details:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!results || results.length === 0) {
        return res.status(404).json({ error: "Pharmacy not found" });
      }
      res.json(results[0]); // Send the first result (assuming id is unique)
    });
  } catch (error) {
    console.error("Error fetching pharmacy details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPharmacyProducts = async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch products associated with the pharmacy ID from the database
    const query = "SELECT * FROM products WHERE pharmacyId = ?";
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!results || results.length === 0) {
        return res
          .status(404)
          .json({ error: "Products not found for this pharmacy" });
      }
      res.json(results); // Send the products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createPharmacy = async (req, res) => {
  const { name, location, street } = req.body;
  const userId = req.user.id; // Assuming you have userId in the request

  // Perform validation
  if (!name || !location || !street) {
    return res.status(400).send("All fields are required");
  }

  // Insert pharmacy
  const insertQuery =
    "INSERT INTO pharmacies (name, location, street, userId) VALUES (?, ?, ?, ?)";
  db.query(
    insertQuery,
    [name, location, street, userId],
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

const editPharmacy = async (req, res) => {
  const { id } = req.params;
  const { name, location, street } = req.body;

  try {
    // Update the pharmacy details
    const updateQuery = `
      UPDATE pharmacies 
      SET name = ?, location = ?, street = ?
      WHERE id = ?`;

    const queryParams = [name, location, street, id];

    await db.query(updateQuery, queryParams);

    res.json({ message: "Pharmacy updated successfully", pharmacyId: id });
  } catch (error) {
    console.error("Error updating pharmacy:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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

const getLicenseInfo = async (req, res) => {
  const userId = req.user.id;

  const query = `
  SELECT users.firstname, users.lastname, users.email, license.id, license.licenseId, license.issueDate, license.expiryDate, license.license, license.status
  FROM users
  INNER JOIN license ON users.id = license.userId
  WHERE users.id = ?
`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: ", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }

    if (!results || results.length === 0) {
      return res
        .status(404)
        .send({ message: "No license found for this user." });
    }

    const licenseInfo = results[0];
    res.status(200).json(licenseInfo);
  });
};

const getLocationChart = async (req, res) => {
  const userId = req.user.id; // Get the user's ID from the request

  const sql = `
    SELECT location, COUNT(*) as count
    FROM pharmacies
    WHERE userId = ?
    GROUP BY location
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllProducts,
  getPharmaciesForUser,
  createProduct,
  editProduct,
  deleteProduct,
  getPharmacyById,
  getPharmacyProducts,
  createPharmacy,
  editPharmacy,
  deletePharmacy,
  getLicenseInfo,
  getLocationChart,
};
