import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ideasRoutes from "./routes/ideasRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import connectDB from "./config/db.js";
// DOTENV CONFIG
dotenv.config();
// MONGODB
connectDB();
const PORT = process.env.PORT || 8080;
// EXPRESS APP
const app = express();
// Alloed origins
const allowedOrigins = [
    'http://localhost:3000',
]
// MIDDLEWARE
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/ideas", ideasRoutes);
app.use("/api/auth", authRoutes);
// 404 Fallback
app.use((req,res, next) => {
    const error = new Error(`Not Found = ${req.originalUrl}`);
    res.status(404);
    next(error);
})
// ERROR HANDLER
app.use(errorHandler)
// LISTEN
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
})