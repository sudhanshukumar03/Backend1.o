import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, username, password } = req.body;

    // ✅ Validate fields
    if ([fullName, email, username, password].some(field => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }
    console.log(req.files);

    // ✅ Get file paths
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    console.log("👉 Avatar path:", avatarLocalPath);
    console.log("👉 Cover path:", coverImageLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    console.log("📂 Files:", req.files);

    // ✅ Upload avatar
    const avatar = await uploadToCloudinary(avatarLocalPath);

    if (!avatar?.url) {
        throw new ApiError(500, "Failed to upload avatar");
    }

    // ✅ Upload cover image (optional)
    let coverImageUrl = "";
    if (coverImageLocalPath) {
        const coverImage = await uploadToCloudinary(coverImageLocalPath);
        coverImageUrl = coverImage?.url || "";
    }

    // ✅ Create user
    const user = await User.create({
        fullname: fullName,
        avatar: avatar.url,
        coverImage: coverImageUrl,
        email,
        username: username.toLowerCase(),
        password
    });

    // ✅ Remove sensitive fields
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -__v"
    );

    if (!createdUser) {
        throw new ApiError(500, "User creation failed");
    }

    // ✅ Send response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

export { registerUser };






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