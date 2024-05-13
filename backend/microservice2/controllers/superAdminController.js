const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const db = require("../db.js");
const moment = require('moment');
require("dotenv").config();
const mailer = require("../services/mailer.js");

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
  const { firstname, lastname, email, roleId, verified } = req.body;

  // Perform validation
  if (!firstname || !lastname || !email || !roleId || !verified) {
    return res
      .status(400)
      .send("Firstname, lastname, email, verified and roleId are required");
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
        SET firstname = ?, lastname = ?, email = ?, roleId = ?, verified =?
        WHERE id = ?`;

      const queryParams = [
        firstname,
        lastname,
        email,
        roleId,
        verified,
        userId,
      ]; // Put 'userId' at the end

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
    ;

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

const getAllUserIds = async (req, res) => {
  const query = "SELECT id, firstname FROM users"; // Fetching id and firstname

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
  const { name, location } = req.body;

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
        SET name = ? , location = ? 
        WHERE id = ?`;

      const queryParams = [name, location, pharmacyId];

      await db.query(updateQuery, queryParams);

      res.send({
        message: "Pharmacy updated successfully",
        pharmacyId: pharmacyId,
      }); //userId: userId
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

const getUserGrowth = async (req, res) => {
  // Get the total number of users
  db.query("SELECT COUNT(*) as total FROM users", function (err, res1) {
    if (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      const totalUsers = res1[0].total;

      // Get the number of users created in the last month
      db.query(
        "SELECT COUNT(*) as newUsers FROM users WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 WEEK)",
        function (err, res2) {
          if (err) {
            res
              .status(500)
              .json({ error: "Internal Server Error", details: err.message });
          } else {
            const newUsers = res2[0].newUsers;

            // Calculate the growth percentage
            const growth = (newUsers / totalUsers) * 100;

            res.json({ growth });
          }
        }
      );
    }
  });
};

const getAdminGrowth = async (req, res) => {
  // Get the total number of admins
  db.query("SELECT COUNT(*) as total FROM users WHERE roleId = 2", function (err, res1) {
    if (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      const totalAdmins = res1[0].total;

      // Get the number of admins created in the last week
      db.query(
        "SELECT COUNT(*) as newAdmins FROM users WHERE roleId = 2 AND created_at > DATE_SUB(NOW(), INTERVAL 1 WEEK)",
        function (err, res2) {
          if (err) {
            res
              .status(500)
              .json({ error: "Internal Server Error", details: err.message });
          } else {
            const newAdmins = res2[0].newAdmins;

            // Calculate the growth percentage
            const growth = (newAdmins / totalAdmins) * 100;

            res.json({ growth });
          }
        }
      );
    }
  });
};

const getPharmacyCountAndGrowth = async (req, res) => {
  // Get the total number of pharmacies
  db.query("SELECT COUNT(*) as total FROM pharmacies", function (err, res1) {
    if (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      const totalPharmacies = res1[0].total;

      // Get the number of pharmacies created in the last week
      db.query(
        "SELECT COUNT(*) as newPharmacies FROM pharmacies WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 WEEK)",
        function (err, res2) {
          if (err) {
            res
              .status(500)
              .json({ error: "Internal Server Error", details: err.message });
          } else {
            const newPharmacies = res2[0].newPharmacies;

            // Calculate the growth percentage
            const growth = (newPharmacies / totalPharmacies) * 100;

            res.json({ totalPharmacies, growth });
          }
        }
      );
    }
  });
};

const getDailyRegistrations = async (req, res) => {
  try {
    let registrations = [];
    for(let i = 6; i >= 0; i--) {
      const startOfDay = moment().subtract(i, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
      const endOfDay = moment().subtract(i, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss');

      const query = `
        SELECT COUNT(*) as count 
        FROM users 
        WHERE created_at BETWEEN ? AND ?`;

      db.query(query, [startOfDay, endOfDay], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Server Error');
        }

        registrations.push({
          day: `Day ${6 - i + 1}`,
          registrations: results[0].count
        });

        if (i === 0) {
          res.json(registrations);
          console.log(registrations);
        }
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const getDailyLogins = async (req, res) => {
  const query = `
    SELECT DATE(login_time) as day, COUNT(*) as logins
    FROM logins
    GROUP BY DATE(login_time)
    ORDER BY day ASC
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Database error." });
    }

    res.json(result);
  });
};

const fetchPendingLicenses = async (req, res) => {
  const selectQuery = "SELECT license.licenseId, license.userId, license.issueDate, license.expiryDate, license.license, license.status, users.firstname, users.lastname, users.email FROM license INNER JOIN users ON license.userId = users.id WHERE license.status = 'PENDING'";

  db.query(selectQuery, (selectErr, result) => {
      if (selectErr) {
          console.error("Error executing MySQL query: ", selectErr);
          return res.status(500).send("Internal Server Error: " + selectErr.message);
      }
      res.send({
          message: "Fetched pending licenses successfully",
          data: result
      });
  });
};

const approveUser = async (req, res) => {
  const { userId, licenseId } = req.body;

  if (!userId || !licenseId) {
    return res.status(400).send("User ID and License ID are required");
  }

  const updateLicenseQuery = "UPDATE license SET status = 'APPROVED' WHERE licenseId = ?";
  const updateUserQuery = "UPDATE users SET roleId = 2 WHERE id = ?";

  // Fetch the user's email
  const selectUserQuery = "SELECT email FROM users WHERE id = ?";
  db.query(selectUserQuery, [userId], function(error, userResult) {
    if (error) {
      console.error("Error executing MySQL query: ", error);
      return res.status(500).send("Internal Server Error: " + error.message);
    }
    if (userResult.length > 0) {
      const userEmail = userResult[0].email;

      // Send the email
      var mailOptions = {
        from: "your-email@gmail.com",
        to: userEmail,
        subject: "Request Approval",
        text: `Hello, your request has been approved. Now you can create your pharmacies.`,
      };

      mailer.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      db.query(updateLicenseQuery, [licenseId], function(error, result) {
        if (error) {
          console.error("Error executing MySQL query: ", error);
          return res.status(500).send("Internal Server Error: " + error.message);
        }
        db.query(updateUserQuery, [userId], function(error, result) {
          if (error) {
            console.error("Error executing MySQL query: ", error);
            return res.status(500).send("Internal Server Error: " + error.message);
          }
          res.send({
            message: "User approved successfully"
          });
        });
      });
    } else {
      console.error("User not found");
      return res.status(404).send("User not found");
    }
  });
};

const declineUser = (req, res) => {
  const { userId, licenseId } = req.body;

  if (!userId || !licenseId) {
    return res.status(400).send("User ID and License ID are required");
  }

  const deleteLicenseQuery = "DELETE FROM license WHERE licenseId = ?";

  // Fetch the user's email
  const selectUserQuery = "SELECT email FROM users WHERE id = ?";
  db.query(selectUserQuery, [userId], function(error, userResult) {
    if (error) {
      console.error("Error executing MySQL query: ", error);
      return res.status(500).send("Internal Server Error: " + error.message);
    }
    if (userResult.length > 0) {
      const userEmail = userResult[0].email;

      // Send the email
      var mailOptions = {
        from: "your-email@gmail.com",
        to: userEmail,
        subject: "Request Declined",
        text: `Hello, your request has been declined. Please check you information again and send another request.`,
      };

      mailer.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      db.query(deleteLicenseQuery, [licenseId], function(error, result) {
        if (error) {
          console.error("Error executing MySQL query: ", error);
          return res.status(500).send("Internal Server Error: " + error.message);
        }
        res.send({
          message: "User declined successfully"
        });
      });
    } else {
      console.error("User not found");
      return res.status(404).send("User not found");
    }
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
  editPharmacy,
  getUserGrowth,
  getAdminGrowth,
  getPharmacyCountAndGrowth,
  getDailyRegistrations,
  getDailyLogins,
  fetchPendingLicenses,
  approveUser,
  declineUser
};
