
import dotenv from "dotenv";


dotenv.config();

const PORT  = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;
const secretKey = process.env.SECRET_KEY;

if(!mongoURI || !secretKey) {
    throw new Error("MONGODB_URI and SECRET_KEY must be defined in the environment variables");
}

export const getEnvKey = {
    port: PORT,
    mongoURI: mongoURI,
    secretKey: secretKey
};