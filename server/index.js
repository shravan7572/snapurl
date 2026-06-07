require("dotenv").config();
const express=require("express");
const cors=require("cors");
const mongoose = require("mongoose");
const helmet=require("helmet");
const morgan=require("morgan");
const rateLimit = require("express-rate-limit")

const app=express();


app.use(helmet());
app.use(morgan("dev"))
app.use(express.json())

const urlroutes=require("./routes/url");
const loginroute=require("./routes/userlogin")

app.use("/api",urlroutes)
app.use("/", urlroutes) 
app.use("/user",loginroute)

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                   // max 100 requests per 15 min
    message: {
        message: "Too many requests, please try again after 15 minutes!"
    }
})
app.use(limiter)

app.use(cors());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected "))
  .catch((err) => console.log("MongoDB Error ", err));

app.listen(5001,()=>{
    console.log("You're server is running on http://localhost:5001/")
})
