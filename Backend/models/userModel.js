import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role:{
        type: String,
        enum: ['student', 'educator'],
    },
    photoUrl: {
        type: String,
        default: null
    },
    enrolledCourses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    walletAddress:{
        type: String,
        required:true,
        unique:true
    },
    resetOtp:{
        type: String,
    },
    otpExpires:{
        type: Date,
    },
    isOtpVerified:{
        type: Boolean,
        default: false
    }


}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;