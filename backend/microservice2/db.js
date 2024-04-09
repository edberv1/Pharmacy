const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database:'pharmacy'
})

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to the database!");
});

module.exports = db;
