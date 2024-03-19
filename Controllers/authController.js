import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

dotenv.config();

  
const generateResetToken = async (user) => {
    console.log('Generating reset token for user:', user.email);
    try {
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 600000;
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Send the reset link to the user's email
        await sendResetEmail(user.email, resetToken);

        return resetToken;
    } catch (error) {
        console.error(error);
        throw new Error('Error generating reset token');
    }
};


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
        const { fullname, email, phonenumber, password } = req.body;

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
            phonenumber,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

     // Generate access token
     const accessToken = generateAccessToken(newUser);

     // Return the user details along with the access token
     res.status(201).json({ message: 'User registered successfully', user: { _id: newUser._id, fullname, email, phonenumber }, accessToken });
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

        res.status(200).json({ message: `Welcome back, ${user.email}! Login successful.`, user: { _id: user._id, fullname: user.fullname, email: user.email, phonenumber: user.phonenumber }, accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '2h',
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_SENDER, // Use the configured sender email
            to: email, // Use the dynamic recipient email
            subject: 'Password Reset',
            text: `Click the following link to reset your password: http://localhost:5858/reset/${token}`,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        console.log('Successfully sent email', info.response);
        return res.json({ status: 'Success' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
 


const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash the new password and update the user's password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Clear the reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


  
  export { register, login, forgotPassword, resetPassword };
