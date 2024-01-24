import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

// @desc User Registration
// @route POST /api/v1/users/register
// @access Public

export const registerUserController = asyncHandler(async(req, res) => {
    // check if user exists
    const {fullname, email, password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists) {
        throw new Error("User already exists");
    };
    // hash password: highest number = more secure but slower
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);
    // create user with mongoose create method
    const user = await User.create({
        fullname,
        email,
        password: hashedPwd,
    });
    //send response back to user
    res.status(201).json ({
        status: 'success',
        message: 'User registered successfully',
        data: user,
    });
});

// @desc User Login
// @route POST /api/v1/users/login
// @access Public

export const loginUserController = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    // find user in db by email
    // de-hash password 
    const userFound = await User.findOne({
        email,
    });
    // check password against hashed password stored
    if(userFound && await bcrypt.compare(password, userFound?.password)) {
        return res.json({
            status: "Success",
            message: "User logged in.",
            userFound,
            token: generateToken(userFound?._id),
        });
    } else {
        throw new Error("Invalid login credentials");
    }
});

// @desc Get user profile
// @route GET /api/v1/users/profile
// @access Private

export const getUserProfileController = asyncHandler(async(req, res)=> {
    const token = getTokenFromHeader(req);
    //verify token
    const verified = verifyToken(token);
    res.json({
    msg: "Wecome to profile page",
    });
});