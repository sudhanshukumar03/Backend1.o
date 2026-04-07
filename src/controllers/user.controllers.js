import { log } from "console";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler(async (req, res) => {
 // res.status(200).json({
  //  message: "OK"
 // });


 //get user details from frontend
 //validate user details
 //check if user already exists:username or email
 //hash password
 //save user to database
 //send response to frontend
 //upload avatar and cover image to cloudinary
 //save cloudinary urls in database
 //create user model and save to database
 //remove password and refresh token from response
 //check for user creation success and send appropriate response to frontend
 //return res.status(201).json({
 //   success:true,
 //   message:"User registered successfully",
 //   data:{
 //     user:createdUser,
 //   }
 // })

 const {fullName, email, username, password} = req.body
 console.log("email: ", email);
/*
 if(fullName === ""){
    throw new ApiError(400,"Full name is required");
 }
 if(email === ""){
    throw new ApiError(400,"Email is required");
 }
 if(username === ""){
    throw new ApiError(400,"Username is required");
 }
 if(password === ""){
    throw new ApiError(400,"Password is required");
 }
*/
if(
    [fullName,email,username,password].some((field)=>
    field ?.trim()===""
)){
    throw new ApiError(400,"All fields are required");
}

const existingUser = await User.findOne({
    $or:[
        {username},
        {email}
    ]
})
if(existingUser){
    throw new ApiError(400,"User with this username or email already exists");  
}
const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;
if(!avatarLocalPath ){
    throw new ApiError(400,"Avatar is required");
}
const avatar=await uploadToCloudinary(avatarLocalPath);
const coverImage = await uploadToCloudinary(coverImageLocalPath);
if(!avatar){
    throw new ApiError(500,"Failed to upload avatar");
}
const User =await User.create({//database me user create karna hai
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,  
    username:username.tolowerCase(),
    password
})
const createdUser = await User.findById(User._id).select(
    "-password -refreshToken -__v  "
)
if(!createdUser){
    throw new ApiError(500,"Failed to create user");    


}
return res.status(201).json(//json response bhejna hai frontend ko to uska format banana hai as api response
    new ApiResponse(200,createdUser,"User registered successfully"  )//ApiResponse class ka object create karna hai jisme status code, data aur message hoga//createdUser ko data ke roop me bhejna hai aur message me success ka message dena hai
);//createdUser ka use karna hai data ke roop me aur message me success ka message dena hai
});


export { registerUser };