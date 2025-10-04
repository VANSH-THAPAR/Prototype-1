const mongoose = require('mongoose');
const studentSchema = mongoose.Schema({
    
});

const Student = mongoose.model('Student',studentSchema);
module.exports = Student;