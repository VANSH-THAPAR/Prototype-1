const express = require('express')
const router = express.Router();
const Alumni = require("../models/alumniSchema");
const Student = require("../models/studentSchema")

router.get('/fetch-total', async (req,res)=>{
    try{
        const countAlumni = await Alumni.countDocuments({});
        const countStudent = await Student.countDocuments({});
        res.status(200).json({totalStudents : countStudent , totalAlumni : countAlumni});
    }catch(err){
        res.status(500).json({totalStudents : "Unable to fetch total students" , totalAlumni : "Unable to fetch total alumnis"});
    }
})

module.exports = router;