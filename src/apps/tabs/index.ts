import express from "express"
import { MongoDatabaseService } from "../../libraries/db/mongo"
import { RequestLogger } from "../../libraries/middleware/requestLogger"
import { TabController } from "./controllers"
import { TabData, TabRepository } from "./repository/repository"
import { TabRouteHandler } from "./routes"
import { TabService } from "./service/service"

export const tabs = express()

// const databaseService = fileDatabaseFactory<TabData>(__dirname + "/.db/db") 

const databaseService = new MongoDatabaseService<TabData>(
    "mongodb://127.0.0.1:27017",
    "tabs",
    "tabData",
)
const tabRepository = new TabRepository(databaseService)
const tabService = new TabService(tabRepository)

const routeHandler = new TabRouteHandler(
    express.Router(),
    new TabController(tabService),
    new RequestLogger(),
)

tabs.use("/", routeHandler.router)
