const express = require('express');
const router = express.Router();
const Alumni = require('../models/alumniSchema');
const mongoose = require('mongoose');

router.get('/get-alumni',async (req,res)=>{
    try{
        const findAlumni = await Alumni.find(req.query);
        console.log(req.query);
        res.status(200).send(findAlumni);
    }catch(err){
        res.status(500).json({"Unable to get the total alumni": err.message});
    }
})

router.post("/add-alumni",async (req,res)=>{
    try{
        const {name , StudentId , universityEmail , personalEmail , contactNumber , fatherName , motherName , nationality , gender , role , ProfilePicture , dob , profession , CompanyName , batchYear , degreeProgram , LinkedinURL} = req.body;
        
        const createAlumni = await Alumni.create(req.body);
        res.status(200).send(createAlumni);
    }catch(err){
        res.status(500).json({"Failed to add the alumni":err.message});
    }
})

router.delete('/delete-alumni/:StudentId',async (req,res)=>{
    try{
        const {StudentId} = req.params;
        const deleteAlumni = await Alumni.findOneAndDelete(StudentId);
        res.status(200).send(deleteAlumni);
    }catch(err){
        res.status(500).json({"Unable to delete the Alumni":err.message});
    }
})

module.exports = router;