import express, { NextFunction, Request, Response } from 'express';
import { TabController } from './controllers'
import logRequest from '../../libraries/middleware/logRequest';


type ExpressRoutesFunc = (req: Request, res: Response, next?: NextFunction) => void | Promise<void>

export class TabRouter {
    public router: express.Router

    constructor(tabController: TabController) {
        this.router = express.Router()
        
        this.router
            .post("/", this.postTab(tabController))
            .get("/:id", this.getTab(tabController))
            .delete("/:id", this.deleteTab(tabController))
            .post("/:id/transaction", this.postTransaction(tabController))
    }

    getTab(tabController: TabController): ExpressRoutesFunc {
        return function(req: Request, res: Response, next?: NextFunction) {
            if (next === undefined) {
                return
            }

            logRequest(req)
            tabController.getTab(req, res)
        }
    }
    
    postTab(tabController: TabController): ExpressRoutesFunc {
        return function(req: Request, res: Response, next?: NextFunction) {
            if (next === undefined) {
                return
            }

            logRequest(req)
            tabController.newTab(req, res)
        }
    }

    deleteTab(tabController: TabController): ExpressRoutesFunc {
        return function(req: Request, res: Response, next?: NextFunction) {
            if (next === undefined) {
                return
            }

            logRequest(req)
            tabController.deleteTab(req, res)
        }
    }

    postTransaction(tabController: TabController): ExpressRoutesFunc {
        return function(req: Request, res: Response, next?: NextFunction) {
            if (next === undefined) {
                return
            }

            logRequest(req)
            tabController.postTransaction(req, res)
        }
    }
}
