import express from "express"
import { tabs } from "./apps/tabs/index"

export const app = express()

app.use(express.json()).use("/api/tabs", tabs)
