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


const getCart = async (req, res) => {
    try {
      const { userId } = req.params; // Get the userId from the URL parameters
  
      const query = "SELECT * FROM cart WHERE userId = ?";
      const values = [userId];
      console.log(req.params.userId);
      db.query(query, values, (err, results) => {
        if (err) {
          console.error("Error fetching cart items:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        if (!results || results.length === 0) {
          return res.status(404).json({ error: "Cart items not found" });
        }
        res.json(results); // Send all the cart items
      });
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  



module.exports = {
  addToCart,
  getCart,
};
