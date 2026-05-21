export interface UserInterface {
    fullname: string;
    email: string;
    password: string;
    refresh_token?: string;
    last_login?: Date;
    profile_picture_url?: string;
}