import { NextFunction, Request, Response } from "express"

export type ExpressRoutesFunc = (
    req: Request,
    res: Response,
    next?: NextFunction,
) => void | Promise<void>
