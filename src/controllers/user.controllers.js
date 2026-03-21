import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {User} from "../models/user.models.js";  
import { uploadToCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req,res)=>{
   

    const {fullname,email,password,username}=req.body;

    // if(!fullname || !email || !password || !username){
    //     throw new ApiError(400,"All fields are required");
    // }
    if([fullname,email,password,username].some((field)=>!field || field.trim()==="")){
        throw new ApiError(400,"All fields are required");
    }

    const existingUser = await User.findOne({
        $or:[{email},{username}]
    })
    if(existingUser){
        throw new ApiError(409,"User already exists");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required");
    }

    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);
    
    if(!avatar){
        throw new ApiError(400,"Avatar is required");
    }
    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
const createdUser = await User.findById(user._id).select("-password -refreshToken")

if(!createdUser){
    throw new ApiError(500,"Something went wrong");
}

return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
)

})


export {registerUser};