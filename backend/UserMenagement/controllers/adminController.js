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

const getLowStock = async (req, res) => {
  const userId = req.user.id; // Assuming you have userId in the request
  const query =
    "SELECT products.*, pharmacies.name as pharmacyName FROM products INNER JOIN pharmacies ON products.pharmacyId = pharmacies.id WHERE products.stock < 20 AND pharmacies.userId = ?";
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

const getStatistics = async (req, res) => {
  const userId = req.user.id; // Assuming you have userId in the request

  // Query to get the number of pharmacies
  const query1 =
    "SELECT COUNT(*) as pharmacies FROM pharmacies WHERE userId = ?";

  // Query to get the balance
  const query2 =
    "SELECT SUM(price * stock) as balance FROM products WHERE pharmacyId IN (SELECT id FROM pharmacies WHERE userId = ?)";

  // Query to get the number of products
  const query3 =
    "SELECT SUM(stock) as products FROM products WHERE pharmacyId IN (SELECT id FROM pharmacies WHERE userId = ?)";

  // Query to get the number of sales
  const query4 = "SELECT COUNT(*) as sales FROM sales WHERE sellerId = ?";

  db.query(query1, userId, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: ", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }

    const pharmacies = results[0].pharmacies;

    db.query(query2, userId, (err, results) => {
      if (err) {
        console.error("Error executing MySQL query: ", err);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      }

      const balance = results[0].balance;

      db.query(query3, userId, (err, results) => {
        if (err) {
          console.error("Error executing MySQL query: ", err);
          return res
            .status(500)
            .json({ error: "Internal Server Error", details: err.message });
        }

        const products = results[0].products;

        db.query(query4, userId, (err, results) => {
          if (err) {
            console.error("Error executing MySQL query: ", err);
            return res
              .status(500)
              .json({ error: "Internal Server Error", details: err.message });
          }

          const sales = results[0].sales;

          res.json({ pharmacies, balance, products, sales });
        });
      });
    });
  });
};

const getSalesData = async (req, res) => {
  const userId = req.user.id;
  const days = req.query.days || 7;

  const query = `SELECT ph.name as pharmacyName, DATE(s.saleDate) as saleDate, COUNT(*) as sales 
                 FROM sales s 
                 JOIN products p ON s.productId = p.id 
                 JOIN pharmacies ph ON p.pharmacyId = ph.id 
                 WHERE s.sellerId = ? AND s.saleDate >= NOW() - INTERVAL ? DAY
                 GROUP BY ph.name, DATE(s.saleDate)`;

  db.query(query, [userId, days], (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: ", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }

    res.json(results);
  });
};
const getMostSoldProduct = async (req, res) => {
  const userId = req.user.id; // Assuming you have userId in the request

  // Query to get the product that was sold the most
  const query = `SELECT p.name as productName, SUM(s.quantity) as quantity
                 FROM sales s
                 JOIN products p ON s.productId = p.id
                 WHERE s.sellerId = ?
                 GROUP BY p.name
                 ORDER BY quantity DESC
                 LIMIT 1`;

  db.query(query, userId, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: ", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }

    res.json(results[0]);
  });
};

const getTotalSales = async (req, res) => {
  const userId = req.user.id; // Assuming you have userId in the request

  // Query to get the total sales
  const query = `SELECT SUM(s.salePrice * s.quantity) as totalSales
                 FROM sales s
                 WHERE s.sellerId = ?`;

  db.query(query, userId, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: ", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }

    res.json(results[0]);
  });
};

const getLeastSoldProduct = async (req, res) => {
  const userId = req.user.id; // Assuming you have userId in the request

  // Query to get the least sold product
  const query = `SELECT p.name as productName, IFNULL(SUM(s.quantity), 0) as quantitySold
                 FROM products p
                 LEFT JOIN sales s ON p.id = s.productId AND s.sellerId = ?
                 WHERE p.pharmacyId IN (SELECT id FROM pharmacies WHERE userId = ?)
                 GROUP BY p.name
                 ORDER BY quantitySold ASC
                 LIMIT 1`;

  db.query(query, [userId, userId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }

    res.json(results[0]);
  });
};

const getMostProfitableProduct = async (req, res) => {
  const userId = req.user.id; // Assuming you have userId in the request

  const query = `SELECT p.name as productName, SUM(s.salePrice * s.quantity) as profit
                 FROM sales s
                 JOIN products p ON s.productId = p.id
                 WHERE s.sellerId = ?
                 GROUP BY p.name
                 ORDER BY profit DESC
                 LIMIT 1`;

  db.query(query, userId, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: ", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }

    res.json(results[0]);
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
  getLowStock,
  getStatistics,
  getSalesData,
  getMostSoldProduct,
  getTotalSales,
  getLeastSoldProduct,
  getMostProfitableProduct,
};
