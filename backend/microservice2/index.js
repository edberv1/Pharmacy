const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); //for session login save
const cookieParser = require('cookie-parser') //for session login save
const session = require('express-session'); //for session login save
const userRouter = require('./routes/user');

const app = express()
app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true, //ktu lejojm qe cookie me u kon true , lejojm cookie me u enable
    })
  );
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); //kjo vendoset qdoher by defualt per me funsionu.
app.use(express.json());
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


app.listen(8081, () =>{
    console.log("Listening to port 8081")
})

