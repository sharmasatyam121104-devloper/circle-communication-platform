import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;


const connectDb = async(): Promise<void> => {
    try {
        if(!DB_NAME || !DB_URL){
            throw new Error("DB_NAME or DB_URL are not found from env.");
        }
        const conn = await mongoose.connect(`${DB_URL}/${DB_NAME}`)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } 
    catch (error) {
        if(error instanceof Error){
            console.log(`DB Connction Erorr - ${error.message}`);
            return process.exit(1)    
        }
    }
}


export default connectDb