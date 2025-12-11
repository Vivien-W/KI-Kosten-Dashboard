import express from "express";
import cors from "cors";
import { router as promptsRouter } from "./routes/prompts.js";
import dotenv from "dotenv";
import { dashboardRouter } from "./routes/dashboard.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/prompts", promptsRouter);
app.use("/api/prompts/dashboard", dashboardRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server läuft auf Port ${port}`));
