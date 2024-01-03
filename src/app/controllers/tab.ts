import { Request, Response } from "express";

export function getTabs(_: Request,  res: Response) {
    res.send("Hello, World!")
}