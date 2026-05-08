import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    username: { 
        type: String, required: true, unique: true, lowercase: true, trim: true 
    },
    email: {
        type: String, required: true, unique: true, lowercase: true, trim: true,
        match: [/.+\@.+\..+/, "Please use a valid email"]
    },
    fullname: { 
        type: String, required: true, trim: true 
    },
    avatar: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    password: { 
        type: String, required: true, select: false 
    },
    refreshToken: { type: String }

}, { 
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.refreshToken;
            return ret;
        }
    }
});

// Hash password
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
};

// Access token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
};

// Refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
};

export const User = mongoose.model("User", userSchema);
















/*import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    email: {
         type: String, 
         required: true, 
         unique: true, 
         lowercase: true, 
         trim: true 
        },
    fullname: { 
        type: String,
         required: true,
          trim: true 
        },
    avatar: { type: String,
         default: "" 
        },
    coverImage: {
         type: String,
          default: "" 
        },
    password: { 
        type: String, 
        required: true, 
        select: false
     },
    refreshToken: { 
        type: String 
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) 
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        { _id: this._id ,
            //email: this.email;
            //username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
             expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN 
            }
    );
};

export const User = mongoose.model("User", userSchema);
*/