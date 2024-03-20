import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Add validation for email format
        match: /^\S+@\S+\.\S+$/,
    },
    phoneNumbers: [{
        type: String,
        // Add validation for phone number format
        match: /^\+?([0-9]{1,4})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    }],
    password: {
        type: String,
        required: true,
    },
    contactPreferences: {
        type: String,
        enum: ['email', 'phone', 'both'],
        required: true,

    },

    location: {
        type: String,
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
