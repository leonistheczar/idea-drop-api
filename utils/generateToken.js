import { SignJWT } from "jose";
import { JWT_SECRET } from "../utils/getJWTSecret.js";

// Generates a JWT
// @params {Object} payload - Data embedded in token
// @params {String} expiresIn - Token timeout - {'5s', '15m', '7d', '30d'}
export const generateToken = async (payload, expiresIn='15m') => {
    return await new SignJWT(payload)
            .setProtectedHeader({alg: 'HS256'})
            .setIssuedAt()
            .setExpirationTime(expiresIn)
            .sign(JWT_SECRET)
};