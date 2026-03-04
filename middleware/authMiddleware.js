import { jwtVerify } from "jose";
import { JWT_SECRET } from "../utils/getJWTSecret.js";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();

// Protected routes (POST)
export const protect = async (req,res,next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            res.status(401);
            throw new Error("Not authorized");
        }
        const token = authHeader.split(" ")[1];
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const user = await User.findById(payload.userId).select("_id name email");
        if(!user){
            res.status(401);
            throw new Error("User not found")
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({message: "Not authorized, token failed"});
        next(err);
    }
}