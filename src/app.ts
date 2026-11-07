import express from "express";
import apiRoutes from "./routes/index";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

app.use(express.json());

app.use("/api/v1", apiRoutes);
app.use(errorMiddleware);