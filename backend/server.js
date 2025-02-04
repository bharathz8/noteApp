import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connectDB} from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173", 
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
