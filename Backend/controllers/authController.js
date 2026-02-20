import validator from 'validator';
import bcrypt from 'bcrypt';


import UserModel from '../models/userModel.js';
import {generateToken} from '../config/token.js';
import sendMail from '../config/sendMail.js';
import { now } from 'mongoose';



export const SignUp = async (req,res,next) => {
    try{
        const {name,email,password,role,walletAddress} = req.body;
        if(!email || !password || !role || !walletAddress){
            return res.status(400).json({message: 'Please provide all required fields'});
        }
        let existingUser = await UserModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message: 'Please provide a valid email'});
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            role,
            walletAddress
        })

        let token = await generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7*24*60*60*1000
        });
        
        res.status(201).json({message: 'User created successfully', user});
    } catch(error){
        console.log(error);
        res.status(500).json({message: 'Server error'});
        console.log(error);
    }

} 

export const Login = async (req,res,next) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: 'Please provide all required fields'});
        }
        let user = await UserModel.findOne({email});
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        let isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid password'});
        }
        let token = await generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7*24*60*60*1000
        });
        res.status(200).json({message: 'Login successful', user});


    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
}

export const Logout = async (req,res,next) => {
    try{
        res.clearCookie('token');
        res.status(200).json({message: 'Logout successful'});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
}

export const sendOtp = async (req,res) => {
    try{
        const {email} = req.body;
        if(!email){
            return res.status(400).json({message: 'Please provide email'});
        }

        const user = await UserModel.findOne({email});
        
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const otpExpires = new Date(Date.now() + 5*60*1000);
        
        user.resetOtp = otp;
        user.otpExpires = otpExpires;
        user.isOtpVerified = false;

        await user.save();

        await sendMail(email, otp);

        return res.status(200).json({message: 'OTP sent successfully', otp});


    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
}

export const verifyOtp = async (req,res) => {
    try{

        const {email, otp} = req.body;

        if(!email || !otp){
            return res.status(400).json({message: 'Please provide all required fields'});
        }

        const user = await UserModel.findOne({email});

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        if(user.resetOtp !== otp || user.otpExpires < new Date()){
            return res.status(400).json({message: 'Invalid or expired OTP'});
        }

        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.status(200).json({message: 'OTP verified successfully'});



    }catch(error){
        console.log(error);
        return res.status(500).json({message: 'Server error'});
    }
}
export const resetPassword = async (req,res) => {
    try{
        const {email, password} = req.body;

        const user = await UserModel.findOne({email});

        if(!user || !user.isOtpVerified){
            return res.status(404).json({message: 'User does not exist or OTP not verified'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.isOtpVerified = false;

        await user.save();

        res.status(200).json({message: 'Password reset successful'});
        
    }catch(error){
        console.log(error);
        return res.status(500).json({message: 'Server error'});
    }
}