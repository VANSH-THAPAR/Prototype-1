const express = require('express');
const router = express.Router();
const Student = require('../models/studentSchema');
const mongoose = require('mongoose');

router.post("/add-students",async (req,res)=>{
    
    // const {name , StudentId , universityEmail , personalEmail , contactNumber , fatherName , motherName , nationality , gender , role , ProfilePicture , dob , profession , CompanyName , batchYear , degreeProgram , LinkedinURL} = req.body;

    // const createStudent = await Student.create({
    //     name , StudentId , universityEmail , personalEmail , contactNumber , fatherName , motherName , nationality , gender , role , ProfilePicture , dob , profession , CompanyName , batchYear , degreeProgram , LinkedinURL
    // })
})

module.exports = router;