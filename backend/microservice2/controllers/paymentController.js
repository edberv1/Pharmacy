const User = require("../models/userModel");
const Product = require("../models/productModel");
const db = require("../db.js");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(
  "sk_test_51PGhlgRsfVBiTAkfjGCSPkuyEILiiuvluSyy00j4xZF2rmm5VdAWE9CI7w4QFvmenbXfMOr73KDZla6w4UFvMRTm00hBxXzYBD"
);

// app.post('/create-checkout-session', async (req, res) => {
//     const { line_items } = req.body;

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items,
//       mode: 'payment',
//       success_url: 'your-success-url',
//       cancel_url: 'your-cancel-url',
//     });

//     res.json({ id: session.id });
//   });

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const token = req.headers["x-access-token"];
    if (!token) {
      return res
        .status(403)
        .send({ auth: false, message: "No token provided." });
    }
    jwt.verify(token, "pharmacy", (err, decoded) => {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      }
      const userId = decoded.id; // Get the userId from the decoded token

      const query =
        "INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)";
      const values = [userId, productId, quantity];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Error adding product to cart:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).send("Product added to cart successfully");
      });
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getCart = (req, res) => {
  const token = req.headers["x-access-token"];
  
  if (!token) {
    return res.status(403).send("No token provided");
  }

  jwt.verify(token, "pharmacy", (err, decoded) => {
    if (err) {
      return res.status(500).send("Failed to authenticate token");
    }

    const userId = decoded.id;
    const query = "SELECT cart.*, products.name, products.description, products.price, products.produced FROM cart INNER JOIN products ON cart.productId = products.id WHERE cart.userId = ?";

    db.query(query, [userId], (err, result) => {
      if (err) {
        return res.status(500).send("Database error");
      }

      res.status(200).json(result);
    });
  });
};




module.exports = {
  addToCart,
  getCart,
};
