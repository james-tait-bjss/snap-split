import { Request, Response } from "express"
import { TabServiceError } from "./service/errors"

export interface TabService {
    newTab(name: string, users: string[]): Promise<string>
    getTab(id: string): Promise<object>
    deleteTab(id: string): void
    addTransaction(id: string, amount: number, includedUsers: string[]): void
}

export class TabController {
    constructor(private readonly tabService: TabService) {}

    async newTab(req: Request, res: Response) {
        const id = await this.tabService.newTab(req.body["name"], req.body["users"])

        res.send(id)
    }

    async getTab(req: Request, res: Response) {
        try {
            const tab = await this.tabService.getTab(req.params.id)
            res.send(tab)
        } catch (err) {
            if (err instanceof TabServiceError) {
                handleTabServiceError(err, res)
            }
        }
    }

    deleteTab(req: Request, res: Response) {
        try {
            this.tabService.deleteTab(req.params.id)
            res.sendStatus(200)
        } catch (err) {
            if (err instanceof TabServiceError) {
                handleTabServiceError(err, res)
            }
        }
    }

    postTransaction(req: Request, res: Response) {
        try {
            this.tabService.addTransaction(
                req.params.id,
                req.body.amount,
                req.body.users,
            )
            res.sendStatus(200)
        } catch (err) {
            if (err instanceof TabServiceError) {
                handleTabServiceError(err, res)
            }
        }
    }
}

function handleTabServiceError(err: TabServiceError, res: Response) {
    switch (err.name) {
        case "TAB_NOT_EXIST_ERROR":
            res.sendStatus(404)
    }
}
