const mysql = require('mysql');
const db = require('../db.js');

let User = function(user){
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.password = user.password;
    this.roleId = 3 ;
};

User.addUser = function(newUser, result) {
    db.query("INSERT INTO users set ?", newUser, function(err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
};

module.exports= User;
