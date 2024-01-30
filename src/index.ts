import express from "express"
import { receipts } from "./apps/receipts"
import { tabs } from "./apps/tabs/index"

export const app = express()

app.use("/api/tabs", tabs).use("/api/receipts", receipts)
