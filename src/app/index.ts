import express from 'express';
import { tabRouter } from "./routes/tab"

export const app = express();

app.use("/api/tabs", tabRouter)