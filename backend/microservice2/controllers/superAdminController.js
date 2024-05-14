const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const db = require("../db.js");
const moment = require("moment");
require("dotenv").config();
const mailer = require("../services/mailer.js");
const cron = require("node-cron");
const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");

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

const getAllAdminUserIds = async (req, res) => {
  const query = "SELECT id, firstname FROM users WHERE roleId = 2"; // Fetching id and firstname of admin users

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: ", err);
      return res.status(500).send("Internal Server Error: " + err.message);
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "No admin users found" });
    }

    res.json(results);
  });
};

//==========================================STATISTICS====================================

const getUserGrowth = async (req, res) => {
  // Get the total number of users
  db.query("SELECT COUNT(*) as total FROM users", function (err, res1) {
    if (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      const totalUsers = res1[0].total;

      // Get the number of users created in the last day
      db.query(
        "SELECT COUNT(*) as newUsers FROM users WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)",
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
  db.query(
    "SELECT COUNT(*) as total FROM users WHERE roleId = 2",
    function (err, res1) {
      if (err) {
        res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      } else {
        const totalAdmins = res1[0].total;

        // Get the number of admins created in the last week
        db.query(
          "SELECT COUNT(*) as newAdmins FROM users WHERE roleId = 2 AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)",
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
    }
  );
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
        "SELECT COUNT(*) as newPharmacies FROM pharmacies WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)",
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
    let promises = [];
    for (let i = 6; i >= 0; i--) {
      const startOfDay = moment()
        .subtract(i, "days")
        .startOf("day")
        .format("YYYY/MM/DD HH:mm:ss");
      const endOfDay = moment()
        .subtract(i, "days")
        .endOf("day")
        .format("YYYY/MM/DD HH:mm:ss");

      const query = `
        SELECT COUNT(*) as count 
        FROM users 
        WHERE created_at BETWEEN ? AND ?`;

      // Wrap db.query in a new Promise
      let promise = new Promise((resolve, reject) => {
        db.query(query, [startOfDay, endOfDay], (err, results) => {
          if (err) {
            console.error(err);
            reject("Server Error");
          }

          resolve({
            day: startOfDay.split(" ")[0], // Return the date instead of 'Day X'
            registrations: results[0].count,
          });
        });
      });

      promises.push(promise);
    }

    // Use Promise.all to wait for all queries to complete
    let registrations = await Promise.all(promises);

    res.json(registrations);
    console.log(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const getDailyLogins = async (req, res) => {
  const query = `
    SELECT DATE_FORMAT(DATE(login_time), '%Y/%m/%d') as day, COUNT(*) as logins
    FROM logins
    WHERE login_time >= DATE(NOW()) - INTERVAL 6 DAY
    GROUP BY day
    ORDER BY day ASC
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Database error." });
    }

    res.json(result);
  });
};

const deleteOldLogins = () => {
  const query = `
    DELETE FROM logins
    WHERE login_time < DATE_SUB(NOW(), INTERVAL 7 DAY)
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error deleting old logins", err);
    } else {
      console.log("Old logins deleted");
    }
  });
};

// Run deleteOldLogins every day at 00:00
cron.schedule("00 00 * * *", deleteOldLogins);

const fetchPendingLicenses = async (req, res) => {
  const selectQuery =
    "SELECT license.id, license.licenseId, license.userId, license.issueDate, license.expiryDate, license.license, license.status, users.firstname, users.lastname, users.email FROM license INNER JOIN users ON license.userId = users.id WHERE license.status = 'PENDING'";

  db.query(selectQuery, (selectErr, result) => {
    if (selectErr) {
      console.error("Error executing MySQL query: ", selectErr);
      return res
        .status(500)
        .send("Internal Server Error: " + selectErr.message);
    }
    res.send({
      message: "Fetched pending licenses successfully",
      data: result,
    });
  });
};

//===============================================REQUESTS===================================//
const approveUser = async (req, res) => {
  const { userId, licenseId } = req.body;

  if (!userId || !licenseId) {
    return res.status(400).send("User ID and License ID are required");
  }

  const updateLicenseQuery =
    "UPDATE license SET status = 'APPROVED' WHERE licenseId = ?";
  const updateUserQuery = "UPDATE users SET roleId = 2 WHERE id = ?";

  // Fetch the user's email
  const selectUserQuery = "SELECT email FROM users WHERE id = ?";
  db.query(selectUserQuery, [userId], function (error, userResult) {
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

      db.query(updateLicenseQuery, [licenseId], function (error, result) {
        if (error) {
          console.error("Error executing MySQL query: ", error);
          return res
            .status(500)
            .send("Internal Server Error: " + error.message);
        }
        db.query(updateUserQuery, [userId], function (error, result) {
          if (error) {
            console.error("Error executing MySQL query: ", error);
            return res
              .status(500)
              .send("Internal Server Error: " + error.message);
          }
          res.send({
            message: "User approved successfully",
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
  db.query(selectUserQuery, [userId], function (error, userResult) {
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

      db.query(deleteLicenseQuery, [licenseId], function (error, result) {
        if (error) {
          console.error("Error executing MySQL query: ", error);
          return res
            .status(500)
            .send("Internal Server Error: " + error.message);
        }
        res.send({
          message: "User declined successfully",
        });
      });
    } else {
      console.error("User not found");
      return res.status(404).send("User not found");
    }
  });
};

const getProductGrowth = async (req, res) => {
  // Get the total number of pharmacies
  db.query("SELECT COUNT(*) as total FROM products", function (err, res1) {
    if (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      const totalProducts = res1[0].total;

      // Get the number of pharmacies created in the last week
      db.query(
        "SELECT COUNT(*) as newProducts FROM products WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)",
        function (err, res2) {
          if (err) {
            res
              .status(500)
              .json({ error: "Internal Server Error", details: err.message });
          } else {
            const newProducts = res2[0].newProducts;

            // Calculate the growth percentage
            const growth = (newProducts / totalProducts) * 100;

            res.json({ totalProducts, growth });
          }
        }
      );
    }
  });
};

const downloadLicense = (req, res) => {
  const id = req.params.id;
  const query = "SELECT license FROM license WHERE id = ?";

  // Wrap db.query in a new Promise
  let promise = new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error(err);
        reject("Server Error");
      }

      resolve(results);
    });
  });

  promise
    .then((result) => {
      if (!result || result.length === 0) {
        console.error(`No license found with ID: ${id}`);
        return res.status(404).send({ message: "License not found." });
      }

      const license = result[0];
      console.log("License object:", license);

      let filePath = path.normalize(license.license); // Normalize the file path
      const absoluteFilePath = path.join(__dirname, "..", filePath);

      if (!fs.existsSync(absoluteFilePath)) {
        console.error(`File not found at path: ${absoluteFilePath}`);
        return res.status(404).send({ message: "File not found." });
      }

      // Send the file as a response
      res.sendFile(absoluteFilePath);
    })
    .catch((error) => {
      console.error(`Error in downloadLicense function: ${error.message}`);
      res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    });
};

const generateExcel = async (req, res) => {
  const query =
    "SELECT * FROM users";
  db.query(query, async (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: ", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }
    if (!results || results.length === 0) {
      console.log("No users found in database.");
      return res.status(404).json({ error: "No users found" });
    }

    // Convert RowDataPacket objects to plain JavaScript objects
    let users = results.map((row) => {
      return {
        id: row.id,
        firstname: row.firstname,
        lastname: row.lastname,
        email: row.email,
        roleId: row.roleId,
        verified: row.verified,
        created_at: row.created_at,
      };
    });
    console.log("Converted user data: ", users); // Log the converted user data

    // Create a new workbook and worksheet
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet("Users");

    // Define the headers
    let headers = [
      "id",
      "firstname",
      "lastname",
      "email",
      "roleId",
      "verified",
      "created_at",
    ];

    // Add the headers to the worksheet
    headers.forEach((header, index) => {
      worksheet.getCell(1, index + 1).value = header;
    });

    // Add the user data to the worksheet
    users.forEach((user, rowIndex) => {
      headers.forEach((header, columnIndex) => {
        worksheet.getCell(rowIndex + 2, columnIndex + 1).value = user[header];
      });
    });

    // Write to a buffer
    let buffer = await workbook.xlsx.writeBuffer();

    // Set headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=Users.xlsx");

    // Send the buffer
    res.send(buffer);
  });
};

const generatePharmacies = async (req, res) => {
    const query =
      "SELECT pharmacies.id, pharmacies.name, pharmacies.location, pharmacies.created_at, users.firstname, users.lastname, users.email FROM pharmacies INNER JOIN users ON pharmacies.userId = users.id";
    db.query(query, async (err, results) => {
      if (err) {
        console.error("Error executing MySQL query: ", err);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      }
      if (!results || results.length === 0) {
        console.log("No pharmacies found in database.");
        return res.status(404).json({ error: "No pharmacies found" });
      }
  
      // Convert RowDataPacket objects to plain JavaScript objects
      let pharmacies = results.map((row) => {
        return {
          id: row.id,
          name: row.name,
          firstname: row.firstname,
          lastname: row.lastname,
          email: row.email,
          location: row.location,
          created_at: row.created_at,  
        };
      });
      console.log("Converted pharmacy data: ", pharmacies); // Log the converted pharmacy data
  
      // Create a new workbook and worksheet
      let workbook = new ExcelJS.Workbook();
      let worksheet = workbook.addWorksheet("Pharmacies");
  
      // Define the headers
      let headers = [
        "id",
        "name",
        "firstname",
        "lastname",
        "email",
        "location",
        "created_at",  
      ];
  
      // Add the headers to the worksheet
      headers.forEach((header, index) => {
        worksheet.getCell(1, index + 1).value = header;
      });
  
      // Add the pharmacy data to the worksheet
      pharmacies.forEach((pharmacy, rowIndex) => {
        headers.forEach((header, columnIndex) => {
          worksheet.getCell(rowIndex + 2, columnIndex + 1).value = pharmacy[header];
        });
      });
  
      // Write to a buffer
      let buffer = await workbook.xlsx.writeBuffer();
  
      // Set headers
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=Pharmacies.xlsx");
  
      // Send the buffer
      res.send(buffer);
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
  getAllAdminUserIds,
  deletePharmacy,
  editPharmacy,
  getUserGrowth,
  getAdminGrowth,
  getPharmacyCountAndGrowth,
  getDailyRegistrations,
  getDailyLogins,
  fetchPendingLicenses,
  approveUser,
  declineUser,
  deleteOldLogins,
  getProductGrowth,
  downloadLicense,
  generateExcel,
  generatePharmacies
};
