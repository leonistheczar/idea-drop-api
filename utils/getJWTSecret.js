import dotenv from "dotenv";
dotenv.config();

// Convert JWT secret into uint8Array
export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_TOKEN);