const db = require('../db.js');

let Pharmacy = function(pharmacy){
    this.name = pharmacy.name;
    this.location = pharmacy.location;
    this.owner = pharmacy.userId ;
    this.created_at = new Date();
};

module.exports= Pharmacy;
