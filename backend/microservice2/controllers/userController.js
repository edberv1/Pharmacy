const User = require("../models/userModel");
const db = require("../db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const mailer = require("../services/mailer.js");

const signup = (req, res) => {
  let newUser = new User(req.body);

  User.addUser(newUser, function (err, userId) {
    // userId is the ID of the newly inserted user
    // Check the fields are not empty
    if (
      !newUser.firstname ||
      !newUser.lastname ||
      !newUser.email ||
      !newUser.password
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (err) {
      if (err.message === "User already exists") {
        res.status(400).send("User already exists");
      } else {
        res.send(err);
      }
    } else {
      // Generate tokens
      const accessToken = jwt.sign({ id: userId }, "pharmacy", {
        expiresIn: 86400,
      }); // expires in 24 hours
      const refreshToken = jwt.sign({ id: userId }, "pharmacyRefresh", {
        expiresIn: "7d",
      });

      User.updateRefreshToken(userId, refreshToken, function (err, res) {
        if (err) {
          console.log("Database error: ", err); // Log the error message
        } else {
          console.log("Database response: ", res); // Log the database response
        }
      });

      // Create a verification link
      const verificationLink = `http://localhost:8081/users/verify?token=${accessToken}`;

      // Send the email
      var mailOptions = {
        from: "your-email@gmail.com",
        to: newUser.email,
        subject: "Account Verification",
        text: `Hello, please verify your account by clicking the link: ${verificationLink}`,
      };

      mailer.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(200).send({ auth: true, token: accessToken });
    }
  });
};

// This is your verification route
const verify = (req, res) => {
  // Get the token from the URL
  const token = req.query.token;
  console.log("Token: ", token); // Log the token

  // Verify the token
  jwt.verify(token, "pharmacy", function (err, decoded) {
    console.log("Decoded ID: ", decoded.id); // Log the decoded ID
    if (err) {
      // The token is invalid
      console.log("Token is invalid"); // Log the error
      res.status(400).send("Invalid token");
    } else {
      // The token is valid, update the user's account
      console.log("Token is valid, verifying user"); // Log the success
      User.verifyUser(decoded.id, function (err) {
        if (err) {
          // There was an error verifying the user
          console.log("Error verifying user"); // Log the error
          res.status(500).send("Error verifying user");
        } else {
          // The user was successfully verified
          console.log("User successfully verified"); // Log the success
          res.status(200).send("User successfully verified");
        }
      });
    }
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const query =
    "SELECT users.*, roles.role FROM users INNER JOIN roles ON users.roleId = roles.id WHERE email = ?";
  const values = [email];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send({ auth: false, message: "Database error." });
    }

    if (result.length === 0) {
      return res.status(401).send({ auth: false, message: "User not found." });
    }

    const user = result[0];

    bcrypt.compare(password, user.password, (err, response) => {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: "Failed to compare passwords." });
      }

      if (!response) {
        return res
          .status(401)
          .send({ auth: false, message: "Wrong email/password combination." });
      }

      // Check if the user's email is verified
      if (!user.verified) {
        return res
          .status(401)
          .send({ auth: false, message: "Email not verified." });
      }

      const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        "pharmacy",
        { expiresIn: 21600 }
      ); // 6 hours
      const refreshToken = jwt.sign(
        { id: user.id, role: user.role },
        "pharmacyRefresh",
        { expiresIn: "7d" }
      ); // 7 days
      user.refreshToken = refreshToken;

      // Insert a row into the user_logins table
      const loginQuery = "INSERT INTO logins (userId) VALUES (?)";
      db.query(loginQuery, [user.id], (err, result) => {
        if (err) {
          console.error("Error inserting into logins", err);
        }
      });

      res.json({
        auth: true,
        token: accessToken,
        role: user.role,
        email: user.email,
      });
    });
  });
};

const getLoginUser = async (req, res) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.send({ loggedIn: false });
  }

  jwt.verify(token, "pharmacy", (err, decoded) => {
    if (err) {
      return res.send({ loggedIn: false });
    }

    // You could query your database here to get more user information if needed
    res.send({ loggedIn: true, user: { id: decoded.id, role: decoded.role } });
  });
};

const logoutUser = (req, res) => {
  const refreshToken = req.body.token;
  User.logoutUser(refreshToken, function (err) {
    if (err) {
      // handle error
      res.status(500).send({ auth: false, message: "Failed to logout." });
    } else {
      res.status(200).send({ auth: false, token: null });
    }
  });
};

const refresh = (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(refreshToken, "pharmacyRefresh", (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, "pharmacy", {
      expiresIn: 21600,
    }); // 6 hours
    const newRefreshToken = jwt.sign(
      { id: user.id, role: user.role },
      "pharmacyRefresh",
      { expiresIn: 604800 }
    ); // 7 days

    User.updateRefreshToken(user.id, newRefreshToken, function (err, res) {
      if (err) {
        console.log("Database error: ", err); // Log the error message
        return res
          .status(500)
          .send({ auth: false, message: "Failed to update refresh token." });
      } else {
        console.log("Database response: ", res); // Log the database response
        return res.json({ accessToken, refreshToken: newRefreshToken });
      }
    });
  });
};

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

const submitLicense = async (req, res) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({ message: "No token provided." });
  }

  jwt.verify(token, "pharmacy", async (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: "Failed to authenticate token." });
    }

    // Get the user's id
    const userId = decoded.id;

    // Get the license details from the request body
    const { licenseId, issueDate, expiryDate, license } = req.body;

    // Define the status as 'PENDING'
    const status = "PENDING";

    // Define the SQL query
    const query = `
      INSERT INTO license (licenseId, issueDate, expiryDate, license, status, userId)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Define the values
    const values = [licenseId, issueDate, expiryDate, license, status, userId];

    // Execute the query
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error executing MySQL query: ", err);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      }
      res.status(200).send({ message: "License submitted successfully." });
    });
  });
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch pharmacy details from the database based on the id
    const query = "SELECT * FROM users WHERE id = ?"; // Example: Using Mongoose to query MongoDB
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
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  signup,
  loginUser,
  getLoginUser,
  logoutUser,
  verify,
  refresh,
  getAllPharmacies,
  getPharmacyById,
  submitLicense,
  getUserById,
};
