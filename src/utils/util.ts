import express from 'express';
const app = express()
import { db } from '../configs/database.config';
import Logger from '../configs/logger.config';

const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next); // Catch errors and pass them to next()
};

const logger = Logger.init(app)

export {
  logger, db, asyncHandler
}