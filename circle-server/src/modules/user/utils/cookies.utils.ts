import { Response } from "express"

export const setAccessAndRefreshToken = (res: Response, access_token: string, refresh_token: string )=>{
        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development" ? false : true,
            sameSite: process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development" ? "lax" : "none",
            maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES)
        })

        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development" ? false : true,
            sameSite: process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development" ? "lax" : "none",
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES)
        })
}

