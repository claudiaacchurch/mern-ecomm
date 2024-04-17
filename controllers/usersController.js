import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

// @desc User Registration
// @route POST /api/v1/users/register
// @access Public

export const registerUserController = asyncHandler(async (req, res) => {
  // check if user exists
  const { firstName, lastName, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }
  // hash password: highest number = more secure but slower
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(password, salt);
  // create user with mongoose create method
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPwd,
  });
  // send response back to user
  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: user,
  });
});

// @desc User Login
// @route POST /api/v1/users/login
// @access Public

export const loginUserController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // find user in db by email
  // de-hash password
  const userFound = await User.findOne({
    email,
  });
  // check password against hashed password stored
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    return res.json({
      status: "Success",
      message: "User logged in.",
      userFound,
      token: generateToken(userFound?._id),
    });
  }
  throw new Error("Invalid login credentials");
});

// @desc Get user profile
// @route GET /api/v1/users/profile
// @access Private

export const getUserProfileController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userAuthId).populate("orders");
  res.json({
    status: "success",
    msg: "user profile fetched sucessfully",
    user,
  });
});

// @desc Update user profile (update shipping address)
// @route PUT /api/v1/users/update/shipping
// @access Private

export const updateShippingAddressController = asyncHandler(
  async (req, res) => {
    const { firstName, lastName, city, postalCode, province, country, phone } =
      req.body;
    // find user by id and update shipping address
    const user = await User.findByIdAndUpdate(
      req.userAuthId,
      {
        shippingAddress: {
          firstName,
          lastName,
          city,
          postalCode,
          province,
          country,
          phone,
        },
        hasShippingAddress: true,
      },
      { new: true }
    );
    res.json({
      status: "success",
      message: "User shipping address updated successfully.",
      user,
    });
  }
);

// @desc Get user profile
// @route GET /api/v1/users/check-email
// @access Private

export const checkUserExistsCotroller = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({
      status: "fail",
      msg: "Email query parameter required",
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    res.json({
      status: "success",
      msg: "Email already registered",
      exists: true,
    });
  } else {
    res.json({
      status: "success",
      msg: "Email not registered",
      exists: false,
    });
  }
});
