const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const superAdminRouter = require('./routes/superAdmin.js');
const paymentRouter = require('./routes/payment.js')

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Apply bodyParser.json() middleware only to specific routes
app.use(['/users', '/admin', '/superAdmin', '/uploads'], bodyParser.json());


app.use(
  session({
    key: "id",
    secret: "pharmacy",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 6, // 6 hours
    },
  })
);

app.use('/users', userRouter);
app.use('/admin', adminRouter);
app.use('/superAdmin', superAdminRouter);
app.use('/payment', paymentRouter);
app.use('/uploads', express.static('uploads'));

app.listen(8081, () => {
  console.log("Listening to port 8081")
});
