import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// DOTENV CONFIG
dotenv.config();
const PORT = process.env.PORT || 8080;
// EXPRESS APP
const app = express();
// MIDDLEWARE
app.use(cors());

// LISTEN
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
})