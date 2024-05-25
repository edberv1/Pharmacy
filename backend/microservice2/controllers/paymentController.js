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

  jwt.verify(token, "pharmacy", async (err, decoded) => {
    if (err) {
      return res.status(500).send("Failed to authenticate token");
    }

    const userId = decoded.id;

    db.query(
      `SELECT p.name, p.price, c.quantity, c.productId
       FROM cart c
       JOIN products p ON c.productId = p.id
       WHERE c.userId = ?`, [userId],
      async (err, cartItems) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).send("Database error");
        }

        const line_items = cartItems.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items,
          mode: 'payment',
          success_url: 'http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}',
          cancel_url: 'http://localhost:3000/',
          metadata: { userId: userId }
        });

        res.json({ id: session.id });
      }
    );
  });
};
 
const handlePaymentSuccess = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'whsec_5a1d8f54a335ac23f66ad9bf2581e14c61e5dc1d3294f0b4238c0cfb3e71eb41';

  let event;

  try {
    // Verify the event using the raw body and signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    // Debug log to check parsed event
    console.log('Parsed event:', event);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;

    db.query(
      `SELECT productId, quantity FROM cart WHERE userId = ?`, [userId],
      async (err, cartItems) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).send("Database error");
        }

        const productUpdates = cartItems.map(item => (
          new Promise((resolve, reject) => {
            db.query(
              `UPDATE products SET stock = stock - ? WHERE id = ?`, [item.quantity, item.productId],
              (err, result) => {
                if (err) return reject(err);
                resolve(result);
              }
            );
          })
        ));

        try {
          await Promise.all(productUpdates);
          db.query(`DELETE FROM cart WHERE userId = ?`, [userId], (err, result) => {
            if (err) {
              console.error('Database query error:', err);
              return res.status(500).send("Database error");
            }
            res.json({ received: true });
          });
        } catch (err) {
          console.error('Error updating stock:', err);
          res.status(500).send("Database error");
        }
      }
    );
  } else {
    res.json({ received: true });
  }
};

const addToCart = async (req, res) => {
  try {
    console.log('Request body:', req.body);
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
  const { userId, itemId } = req.params; 

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
  createCheckoutSession,
  handlePaymentSuccess
};
