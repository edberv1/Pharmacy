const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
  };

// verify token
const verifyToken = async (req, res) => {
    try {
      const user = await User.findOne({ id: req.params.id });
  
      if (!user) {
        return res.status(400).send({ success: false, error: { message: "Invalid link, user not found" } });
      }
  
      const token = await Token.findOne({
        userId: user.id,
        token: req.params.token,
      });
  
      if (!token) {
        return res.status(400).send({ success: false, error: { message: "Invalid link, token not found." } });
      }
  
      await User.findOneAndUpdate(
        { id: user.id },
        { $set: { verified: true } }
      );
  
      res.status(200).send({ success: true, message: "Email verified successfully" });
    } catch (err) {
      res.status(500).send({ message: "Internal server error", err });
    }
  };

  // signin up an user
const signupUser = async (req, res) => {
    const { firstname, lastname, email, password, roleId } = req.body;
    try {
      // check unique email and pw, then create hash
      const hash = await User.signup(firstname, email, password);
      const user = await User.create({
        firstname,
        lastname,
        email,
        password: hash,
        roleId,
      });
  
      // create verification token
      const token = await new Token({
        userId: user.id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
  
      res.status(200).json({ email, user });
  
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  module.exports = {
    signupUser, verifyToken
  }
  