const db = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//name location foreignAdmin

let Pharmacy = function(pharmacy){
    this.name = pharmacy.name;
    this.location = pharmacy.location;
    this.owner = pharmacy.userId ;
};

module.exports= Pharmacy;
