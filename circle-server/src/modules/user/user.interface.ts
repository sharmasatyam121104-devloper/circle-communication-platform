import { Request } from "express";

export interface UserInterface {
    fullname: string;
    email: string;
    password: string;
    refresh_token?: string;
    last_login?: Date;
    profile_picture_url?: string;
}

export interface SessionInterface extends Request {
  id?: string ;
}