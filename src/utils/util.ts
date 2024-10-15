import express from 'express';
const app = express()
import { db } from '../configs/database.config';
import Logger from '../configs/logger.config';
import { SuccessResponse, ErrorResponse, HttpStatus } from './constant';

const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next); // Catch errors and pass them to next()
};

const logger = Logger.init(app)

function createError(message: string, code = HttpStatus.BAD_REQUEST, detail?: any) {
  const error: any = new Error(message)
  error.code = code
  error.detail = detail
  return error
}

async function ResponseSuccess (res: express.Response, data: any, message?: string): Promise<express.Response>  {
  const successResponse: SuccessResponse<typeof data> = {
    success: true,
    message: message,
    data: data,
  }
  return res.status(HttpStatus.OK).json(successResponse);
}

async function ResponseError (res: express.Response, error: any, message: string, code: number): Promise<express.Response> {
  let sqlError = error.toString().match(/insert|update|select|delete/gi)
  if (sqlError) {
    code = HttpStatus.INTERNAL_SERVER_ERROR
    message = 'SQL Syntax or Query Error !'
    error = {}
  }
  const errorResponse: ErrorResponse = {
    success: false,
    message: message,
    code: code,
    error: error
  }
  return res.status(code).json(errorResponse)
}

async function ResponseErrorValidation (res: express.Response, error: any, message: string, code: number): Promise<express.Response> {
  const errorResponse: ErrorResponse = {
    success: false,
    message: message,
    code: code,
    error: error[0].constraints
  }
  return res.status(code).json(errorResponse)
}

export {
  logger, db, asyncHandler, createError, ResponseSuccess, ResponseError, ResponseErrorValidation
}