import express from "express";
import apiRoutes from "./routes/index";

export const app = express();

app.use(express.json());

app.use("/api/v1", apiRoutes);