const mysql = require('mysql');
const bcrypt = require('bcrypt');
const validator = require('validator');
const db = require('../index.js')

let User = function(user){
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.password = user.password;
    this.roleId = user.roleId;
};

User.signup = async function (username, email, password) {
    // validation 
    if (!email || !password) {
        throw Error('Required fields must be filled')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email invalid')
    }
    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 })) {
        throw Error('Password not strong enough')
    }

    const salt = await bcrypt.genSalt(5)
    const hash = await bcrypt.hash(password, salt)

    return hash
}

User.login = async function (email, password) {
    if (!email || !password) {
        throw Error('Required fields must be filled')
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async function(err, result) {
        if (err) throw err;

        if (result.length === 0) {
            throw Error('Account not found')
        }

        const match = await bcrypt.compare(password, result[0].password)
        if (!match) {
            throw Error('Incorrect password')
        }
        return result[0];
    });
}

User.generateHash = async function (password) {
    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 })) {
        throw Error('Password not strong enough')
    }

    const salt = await bcrypt.genSalt(5)
    const hash = await bcrypt.hash(password, salt)

    return hash
}

module.exports= User;
