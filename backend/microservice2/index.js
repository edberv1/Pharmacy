const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const user = require('./routes/user.js');
const bcrypt = require('bcrypt');
const salt = 10;

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database:'pharmacy'
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users (`firstname`, `lastname`,`email`, `password`) VALUES (?)"
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) =>{
        if(err) return res.json({Error: "Error for hashing password"});
        const values = [
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            hash
    
        ];
        db.query(sql, [values], (err, result) => {
            if(err) return res.json({Error: "Inserting data error in server"})
            return res.json({Status: "Success"});
        })
    })
})


app.listen(8081, () =>{
    console.log("Listening to port 8081")
})

module.exports = db;