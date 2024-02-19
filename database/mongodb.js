const mongoose = require('mongoose')
require('dotenv/config')

MONGODBURL = process.env.DBURL

const connect = async ()=>{
    try {
        await mongoose.connect(MONGODBURL)
        console.log("Connection Successful");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connect