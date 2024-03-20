import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URL = process.env.DBURL;

const connect = async () => {
    try {
        await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connection Successful");
    } catch (error) {
        console.log(error);
    }
};

export default connect;