import { registerAs } from "@nestjs/config";

export default registerAs("auth", () => ({
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirations: process.env.JWT_EXPIRATION
}))