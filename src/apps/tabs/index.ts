import express from 'express';
import fileDatabaseFactory from '../../libraries/db/file';
import { TabRepository } from './repository';
import { TabService } from './service/service';
import { TabController } from "./controllers"
import { TabRouter } from "./routes"

export const tabs = express();

const databaseService = fileDatabaseFactory(__dirname + "/.db/db")
const tabRepository = new TabRepository(databaseService)
const tabService = new TabService(tabRepository)
const tabController = new TabController(tabService)

tabs.use("/", new TabRouter(tabController).router)