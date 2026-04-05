import mongoose, {Schema} from "mongoose";
import { time } from "node:console";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    username: {
        type:string,
        required:true,
        unique:true,
        lowwercase:true,
        trim:true,
        index:true
    },
    email: {
        type:string,
        required:true,
        unique:true,
        lowwercase:true,
        trim:true,
    },
    fullname: { 
        type:string,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:string,//cloudinary url
        required:true,

    },
    coverimage:{
        type:string,//cloudinary url
        required:true,
    },
    watchhistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],

    password: {
        type:string,
        required:[true,"Password is required"],
    },  
    refreshtoken: {
        type:string,
    },
});
{timestamps:true}
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});
userSchema.methods.isPasswordCorrect = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}   
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRES_IN
    });
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN
    });
}


export const User = mongoose.model("User", userSchema);