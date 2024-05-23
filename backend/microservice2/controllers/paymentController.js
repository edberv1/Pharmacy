const User = require("../models/userModel");
const Product = require("../models/productModel");
const db = require("../db.js");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(
  "sk_test_51PGhlgRsfVBiTAkfjGCSPkuyEILiiuvluSyy00j4xZF2rmm5VdAWE9CI7w4QFvmenbXfMOr73KDZla6w4UFvMRTm00hBxXzYBD"
);

const createCheckoutSession = (req, res) => {
  const token = req.headers["x-access-token"];
  
  if (!token) {
    return res.status(403).send("No token provided");
  }

  jwt.verify(token, "pharmacy", (err, decoded) => {
    if (err) {
      return res.status(500).send("Failed to authenticate token");
    }

    const userId = decoded.id;

    // Fetch the cart items for the user
    db.query(
      `SELECT p.name, p.price, c.quantity
       FROM cart c
       JOIN products p ON c.productId = p.id
       WHERE c.userId = ?`, [userId],
      async (err, cartItems) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).send("Database error");
        }

        // Format the cart items for Stripe
        const line_items = cartItems.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100, // Stripe expects the amount in cents
          },
          quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items,
          mode: 'payment',
          success_url: 'http://localhost:3000/',
          cancel_url: 'http://localhost:3000/',
        });

        res.json({ id: session.id });
      }
    );
  });
};




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
    const query = "SELECT cart.*, products.name, products.description, products.price, products.produced, products.image FROM cart INNER JOIN products ON cart.productId = products.id WHERE cart.userId = ?";

    db.query(query, [userId], (err, result) => {
      if (err) {
        return res.status(500).send("Database error");
      }

      res.status(200).json(result);
    });
  });
};

const deleteFromCart = (req, res) => {
  const { userId, itemId } = req.params; // Get the userId and itemId from the URL parameters

  const query = "DELETE FROM cart WHERE userId = ? AND id = ?";
  const values = [userId, itemId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error deleting item from cart:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found in cart" });
    }
    res.json({ message: "Item removed from cart" });
  });
};



module.exports = {
  addToCart,
  getCart,
  deleteFromCart,
  createCheckoutSession
};
