require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const user = require('./routes/user')

const app = express()

// Middlewares
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/user', user);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connection to mongoDB successful")
  })
  .catch((err) => { console.log(err) })

const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT} `)
})