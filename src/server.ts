import { app } from "./app";
import { connectDB } from "./config/db";
import { getEnvKey } from "./lib/env";

const PORT =  getEnvKey.port;


const startServer = async () => {
    try {
         await connectDB();
         app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
};

startServer();


