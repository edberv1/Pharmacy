const db = require('../db.js');

let Products = function(products){
    this.name = products.name;
    this.description = products.description;
    this.produced = products.produced;
    this.price = products.price;
    this.pharmacyId = products.pharmacyId;
    this.stock = products.stock;
    this.created_at = new Date();
};

module.exports= Products;
