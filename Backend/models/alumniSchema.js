const mongoose = require('mongoose');
const alumniSchema = mongoose.Schema({
    name: String,
    StudentId: {
        type: String,
        unique: true,
        required: true,  
    },
    universityEmail: {
        type: String,
        unique: true,
        required: true,
    },
    personalEmail: String,
    contactNumber: String,
    fatherName: String,
    motherName: String,
    nationality: String,
    gender: String,
    role: String,
    ProfilePicture: String,
    dob: Date,
    profession: String,
    CompanyName: String,
    batchYear: String,
    degreeProgram : String,
    LinkedinURL: String,
},{
    timestamps: true
});

const Alumni = mongoose.model('Alumni',alumniSchema);

module.exports = Alumni;