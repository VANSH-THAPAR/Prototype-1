const express = require('express');
const connectDb = require('./db/db');
const app = express();
const PORT = 5000
const dashboard = require('./router/dashboard')
const manageAlumni = require('./router/manageAlumni');
const manageStudent = require('./router/manageStudent');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectDb();
app.use('/',dashboard);
app.use('/',manageAlumni);
app.use('/',manageStudent);


app.get('/',(req,res)=>{
    res.send("Hi")
})

app.listen(PORT,()=>{
    console.log("The app is running")
})