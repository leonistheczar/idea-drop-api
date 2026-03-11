import express from "express";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "../utils/getJWTSecret.js"
const router = express.Router();
// POST
// @route      POST /api/auth
// @desc       Add a new user
// @access     Public
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("All fileds are required");
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }
    const newUser = await User.create({ name, email, password });
    // Create tokens
    const payload = { userId: newUser._id.toString() };
    const accessToken = await generateToken(payload, "1m");
    const refreshToken = await generateToken(payload, "30d");
    // Set http-only cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.status(201).json({
      accessToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
// POST
// @route      POST /api/auth
// @desc       Authenticate a user
// @access     Private
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400);
      throw new Error("Empty fields are not accepted");
    }
    const findUser = await User.findOne({ email: email });
    // Check user email
    if (!findUser) {
      res.status(401);
      throw new Error("Invalid credentials");
    }
    const isMatch = await findUser.matchPass(password);
    // Check and compare hashed password
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }
    // Create tokens
    const payload = { userId: findUser._id.toString() };
    const accessToken = await generateToken(payload, "1m");
    const refreshToken = await generateToken(payload, "30d");
    // Set http-only cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.status(201).json({
      accessToken,
      user: {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
// POST
// @route      POST /api/refresh
// @desc       Refresh the access token
// @access     Public
router.post("/refresh", async (req, res, next) => {
    const token = req.cookies?.refreshToken;
    if(!token){
        res.status(401);
        throw new Error("No refresh token");
    }
    const {payload} = await jwtVerify(token, JWT_SECRET);
    const user = await User.findById(payload.userId);
    if(!user){
        res.status(401);
        throw new Error("No user");
    }
    const newAccessToken = await generateToken({userId: user._id.toString()});
    res.status(201).json({
        accessToken: newAccessToken,
        user: {
            name: user.name,
            email: user.email,
            id: user._id.toString(),
        }
    })
})
// POST
// @route      POST /api/logout
// @desc       Logout the user
// @access     Private
router.post("/logout", async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
});
export default router;
