import express from 'express';
import { getTabs } from '../controllers/tab';

export const tabRouter = express.Router()

tabRouter.get("/", getTabs)
