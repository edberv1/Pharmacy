const db = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let User = function(user){
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.password = bcrypt.hashSync(user.password, 10); // Hash the password
    this.roleId = 3 ;
};

User.addUser = function(newUser, result) {
    db.query("SELECT * FROM users WHERE email = ?", newUser.email, function(err, res) {
        if(err) {
            // console.log("error: ", err);
            result(err, null);
        }
        else if(res.length) {
            // console.log('User already exists');
            result(new Error('User already exists'), null);
        }
        else {
            db.query("INSERT INTO users set ?", newUser, function(err, res) {
                if(err) {
                    // console.log("error: ", err);
                    result(err, null);
                }
                else {
                    // console.log(res.insertId);
                    result(null, res.insertId);
                }
            });
        }
    });
};



module.exports= User;
