import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ideasRoutes from "./routes/ideasRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import connectDB from "./config/db.js";
// DOTENV CONFIG
dotenv.config();
// MONGODB
connectDB();
const PORT = process.env.PORT || 8080;
// EXPRESS APP
const app = express();
// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/ideas", ideasRoutes);
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