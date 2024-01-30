import { DocumentProcessorServiceClient } from "@google-cloud/documentai"
import express from "express"
import fs from "fs"
import multer from "multer"
import { RequestLogger } from "../../libraries/middleware/requestLogger"
import { ReceiptController } from "./controller"
import { ReceiptRouteHandler } from "./routes"
import { GCPReceiptParser } from "./service/receiptParser"
import { ReceiptService } from "./service/service"

const client = new DocumentProcessorServiceClient({
    apiEndpoint: "eu-documentai.googleapis.com",
})

const projectNumber = "661140507135"
const processorID = "6f4ffdbccb92bd16"
const receiptParser = new GCPReceiptParser(client, projectNumber, processorID)
const receiptService = new ReceiptService(receiptParser, fs)
const receiptController = new ReceiptController(receiptService)
const routeHandler = new ReceiptRouteHandler(
    express.Router(),
    receiptController,
    multer({ dest: "uploads/" }),
    new RequestLogger(),
)

export const receipts = express()
receipts.use(express.json()).use("/", routeHandler.router)
