const mongoose = require('mongoose');
require('dotenv').config();
const mongo_url = process.env.MONGO_URL;
const connectDb = async () => {
    try{
        await mongoose.connect(mongo_url);
        console.log("Database got connected !");
    }
    catch(err){
        console.log(err.message);
    }
}
module.exports = connectDb;