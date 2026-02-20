import userModel from '../models/userModel.js';
import uploadOnCloudinary from '../config/cloudinary.js';
import UserModel from '../models/userModel.js';

export const getCurrentUser = async (req, res) => {
    try{
        const user = await userModel.findById(req.userId).select('-password');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
    
        return res.status(200).json({user});
    
    }catch(error){
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

export const updateProfile = async(req,res) =>{
    try{
        const userId = req.userId;
        const{name} = req.body;
        let photoUrl 
        if(req.file){
            photoUrl = await uploadOnCloudinary(req.file.path);
        }
        const user = await UserModel.findByIdAndUpdate(userId, {name, photoUrl}, {new: true}).select('-password');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json({user});
    }catch(error){
        return res.status(500).json({message: 'Internal Server Error'});
        console.log(error);
    }
        
}