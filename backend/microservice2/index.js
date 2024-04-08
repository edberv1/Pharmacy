const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const user = require('./routes/user.js');

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database:'pharmacy'
})

app.use("/api/users", user);


app.listen(8081, () =>{
    console.log("Listening to port 8081")
})

module.exports = db;