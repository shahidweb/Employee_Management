import mongoose from "mongoose";
import { getEnvKey } from "../lib/env"




export const connectDB = async()=>{
    try {
        await mongoose.connect(getEnvKey.mongoURI);
        console.log('DB connected successfully');
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}