const express = require('express');
const connectDb = require('./db/db');
const app = express();
const PORT = 5000

connectDb();

app.get('/',(req,res)=>{
    res.send("Hi")
})

app.listen(PORT,()=>{
    console.log("The app is running")
})