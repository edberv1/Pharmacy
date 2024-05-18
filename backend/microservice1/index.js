require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const contact = require('./routes/contact')


const app = express()

// Middlewares
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})
app.use(express.json);
app.use('/contact', contact);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connection to mongoDB successful")
  })
  .catch((err) => { console.log(err) })

const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT} `)
})

// const express = require('express');
// const mongoose = require('mongoose');
// const contactRoutes = require('./routes/contact'); // Import the contact routes

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware to parse JSON
// app.use(express.json());

// // Database connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false
// })
// .then(() => console.log('MongoDB connected...'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Use the contact routes
// app.use('/api', contactRoutes); // Prefix routes with /api to avoid conflicts

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });



