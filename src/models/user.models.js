import mongoose,{ Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username: {
        type: String,
        required : true,
        unique:true,
        lowercase:true,
        index:true
    },
    email:{
          type: String,
        required : true,
        unique:true,
        lowercase:true,
    },
      fullname:{
          type: String,
        required : true,
        lowercase:true,
    },
      avatar:{
          type: String, // URL of the avatar image from cloudfare
    },
    coverImage:{
        type: String, // URL of the cover image from cloudfare
    },
    watchHistory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        required : true,
    },
    refreshToken:{
        type: String,
    },
},
{timestamps: true}
)


userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
}) 

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
    _id: this._id,
    email: this.email,
        username: this.username,
        fullname: this.fullname,
}, process.env.ACCESS_TOKEN_SECRET, 
{
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
});
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
    _id: this._id
}, process.env.REFRESH_TOKEN_SECRET,
{
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
});
}

export const User = mongoose.model("User", userSchema);