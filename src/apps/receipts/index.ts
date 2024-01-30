import { DocumentProcessorServiceClient } from "@google-cloud/documentai"
import { Storage } from "@google-cloud/storage"
import express, { Request, Response } from "express"
import fs from "fs"
import multer from "multer"

export const receipts = express()
const router = express.Router()

const upload = multer({ dest: "uploads/" })

router.post("/", upload.single("image"), test)


async function test(req: Request, res: Response) {
    const client = new DocumentProcessorServiceClient({
        apiEndpoint: "eu-documentai.googleapis.com",
    })
    const storage = new Storage()

    const projectNumber = "661140507135"
    const processorID = "6f4ffdbccb92bd16"

    if (req.file === undefined) {
        res.sendStatus(400)

        return
    }

    const imageFile = fs.readFileSync(req.file.path)
    const encodedImage = Buffer.from(imageFile).toString("base64")


    res.send({
        items: items,
    })
}

receipts.use(express.json()).use("/", router)
