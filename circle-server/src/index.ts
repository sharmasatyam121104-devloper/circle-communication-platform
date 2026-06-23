import app from "./app";
import './socket';

import dotenv from "dotenv";
dotenv.config();


import connectDb from './config/db';
connectDb();

import "./config/redis.config";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});