import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';

dotenv.config();

const generateAccessToken = (user) => {
    const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';
    const payload = {
        user: {
            id: user._id,
            email: user.email,
        },
    };

    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

const register = async (req, res) => {
    try {
        const { fullname, email, password, phoneNumber, address } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            phoneNumber,
            address,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the provided password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        const successMessage = `Welcome back, ${user.email}! Login successful.`;

        res.status(200).json({ message: successMessage, accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { register, login };
