import express from "express";

export const app = express();

app.use(express.json());


app.get("/", (_, res) => {
    return res.status(200).json({ message: "Welcome to the Employee Management API!" })
});

