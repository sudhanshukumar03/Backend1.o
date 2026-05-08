import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
// Generate tokens
const generateTokens = async (userId) => {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

// REGISTER
export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullname, password } = req.body;

    if (!username || !email || !fullname || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const user = await User.create({
        username,
        email,
        fullname,
        password
    });

    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

// LOGIN
export const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    }).select("+password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "Login successful"
            )
        );
});

// LOGOUT (IMPORTANT: name is logoutUser everywhere)
export const logOutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: "" }
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});
const refreshAccessToken = asyncHandler(async (req,res) => {
  const incomingRefreshToken=req.cookie.refreshToken || req.body.refreshToken;
  if(!incomingRefreshToken){
    throw new ApiError (401,"unauthorized request")
  }
try {
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedToken?._id)
    //if the refresh token is doceded by accessing db be can get user data access 
    if(!User){
     throw new ApiError(401," invalid Refresh Token")
    }
    
    //checking
    if(incomingRefreshToken !== user ?. refreshToken){
        throw new ApiError(401,"Refresh Token is expired")
    }
    const options ={
            httpOnly=true,
            secure=true
    }
    const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
    
    return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json (
        new ApiResponse
        (
              200,
              {accessToken,refreshToken:newRefreshToken} ,
              "Access TOken refreshed successfully"
      )
    )
    
    
} catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh Token");
    }
})
export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken

}


