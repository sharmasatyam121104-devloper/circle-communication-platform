import jwt from "jsonwebtoken";

export const generateAccessToken = (id: string) => {
    return jwt.sign({ id }, process.env.ACCESS_SECRET!, {
        expiresIn: "15m",
    });
};
