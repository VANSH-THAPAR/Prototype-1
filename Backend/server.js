const express = require('express');
const connectDb = require('./db/db');
const app = express();
const PORT = 5000
const dashboard = require('./router/dashboard')
const manageAlumni = require('./router/manageAlumni');
const manageStudent = require('./router/manageStudent');
const cors = require('cors')
const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Load environment variables


app.use(cors());



app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

connectDb();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use('/',dashboard);
app.use('/',manageAlumni);
app.use('/',manageStudent);


app.get('/',(req,res)=>{
    res.send("Hi")
})

app.listen(PORT,()=>{
    console.log("The app is running")
})