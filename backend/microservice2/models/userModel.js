const db = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let User = function(user){
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.password = bcrypt.hashSync(user.password, 10); // Hash the password
    this.roleId = 3 ;
    this.verified = false;
    this.created_at = new Date();
    this.refreshToken = "";
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

User.updateRefreshToken = function(userId, refreshToken, result) {
    db.query("UPDATE users SET refreshToken = ? WHERE id = ?", [refreshToken, userId], function(err, res) {
        if(err) {
            console.log('Database error: ', err); // Log the error message
            result(err, null);
        }
        else {
            console.log('Database response: ', res); // Log the database response
            result(null, res);
        }
    });
};


User.getUserById = function(userId, result) {
    db.query("SELECT * FROM users WHERE id = ?", userId, function(err, res) {
        if(err) {
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};

User.verifyUser = function(userId, result) {
    db.query("UPDATE users SET verified = 1 WHERE id = ?", [userId], function(err, res) {
        if(err) {
            console.log('Database error: ', err); // Log the error message
            result(err, null);
        }
        else {
            console.log('Database response: ', res); // Log the database response
            result(null, res);
        }
    });
};




User.login = function(email, password, result) {
    db.query("SELECT * FROM users WHERE email = ?", email, function(err, res) {
        if(err) {
            result(err, null);
        }
        else if(res.length) {
            const user = res[0];
            if (bcrypt.compareSync(password, user.password)) {
                if (user.verified) {
                    result(null, user);
                } else {
                    result(new Error('Email not verified'), null);
                }
            } else {
                result(new Error('Invalid password'), null);
            }
        }
        else {
            result(new Error('User not found'), null);
        }
    });
};


module.exports= User;
