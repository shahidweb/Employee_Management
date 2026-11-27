import express from "express";
import apiRoutes from "./routes/index";
import { errorMiddleware } from "./middlewares/error.middleware";
import cors from 'cors'

const corsOptions = {
    origin: 'http://localhost:4200',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

export const app = express();

app.use(cors(corsOptions))
app.use(express.json());

app.use("/api/v1", apiRoutes);
app.use(errorMiddleware);