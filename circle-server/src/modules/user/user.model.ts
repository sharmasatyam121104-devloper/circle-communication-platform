import {  models, Schema, model } from "mongoose";
import { UserInterface } from "./user.interface";
import bcrypt, { genSalt } from "bcrypt"

const userSchema = new Schema<UserInterface>({
    fullname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    refresh_token: {
        type: String
    },
    profile_picture_url: {
        type: String,
    },
    last_login: {
        type: Date
    }
},
{
    timestamps: true
})

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next;

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const UserModel = models.User || model<UserInterface>("User", userSchema);

export default UserModel;