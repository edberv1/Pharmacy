const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const userRouter = require('./routes/user');

const app = express()
app.use(cors())
app.use(express.json());
app.use('/users', userRouter);


app.listen(8081, () =>{
    console.log("Listening to port 8081")
})

