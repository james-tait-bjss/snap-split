import { Request, Response } from "express";
import { TabService } from "./service/service";
import { TabServiceError } from "./service/errors";

export class TabController {
    constructor(private readonly tabService: TabService) { }
    
    newTab(req: Request, res: Response) {
        const id = this.tabService.newTab(req.body["name"], req.body["users"])

        res.send(id)
    }

    getTab(req: Request,  res: Response) {
        try {
            const tab = this.tabService.getTab(req.params.id)
            res.send(tab)
        } catch(err) {
            if (err instanceof TabServiceError) {
                handleTabServiceError(err, res)
            }
        }
    }   
}

function handleTabServiceError(err: TabServiceError, res: Response) {
    switch(err.name) {
        case "TAB_NOT_EXIST_ERROR":
            res.status(404)
    }
}