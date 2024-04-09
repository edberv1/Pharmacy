const User = require('../models/userModel');

const signup = (req, res) => {
    let newUser = new User(req.body);
    User.addUser(newUser, function(err, user) {
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
}

module.exports = {
   signup 
}
