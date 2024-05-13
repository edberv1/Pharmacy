const db = require('../db.js');

let License = function(license){
    this.licenseId = license.licenseId;
    this.issueDate = license.issueDate;
    this.expiryDate = license.expiryDate;
    this.license = license.license;
    this.status = license.status;
};

module.exports= License;
