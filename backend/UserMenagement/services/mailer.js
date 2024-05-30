var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vuciternaedber@gmail.com",
    pass: "ueor hiyi ckyj qtos",
  },
});

module.exports.sendMail = function(mailOptions, callback) {
  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      callback(error, null);
    } else {
      console.log("Email sent: " + info.response);
      callback(null, info.response);
    }
  });
};
