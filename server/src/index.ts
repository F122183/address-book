import constants from "constants";

import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

dotenv.config();
connectDB();

const app: Application = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5600;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});