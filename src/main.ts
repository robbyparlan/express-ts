import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from 'http';
import multer from 'multer'
import 'dotenv/config';
import { CustomError, ErrorResponse, ApiEndpointVersion } from "./utils/constant";
import { db, logger } from "./utils/util";
import appRouter from './routes/index.router'
import { error } from "console";
const upload = multer()

const port = normalizePort(process.env.PORT || 3000)
const app = express()
var server = http.createServer(app);


function main() {

  app.use(express.json({
    limit: '10mb'
  }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(upload.any());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(cors({
    origin: '*'
  }))
  
  app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Bismillah Service HRIS")
  });

  app.use(ApiEndpointVersion.version, appRouter)
  
  app.use(function(req: express.Request, res: express.Response, next: express.NextFunction){
    let errorResponse: ErrorResponse<Error> = {
      success: false,
      message: "Endpoint Not Found",
      code: 404,
    };
    logger.info(`-------------------- Endpoint ${req.url} not found`)
    res.status(404).json(errorResponse)
  });

  // error handler
  app.use(function(err: CustomError, req: express.Request, res: express.Response, next: express.NextFunction) {
    // set locals, only providing error in development
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
  
    let errorResponse: ErrorResponse<CustomError> = {
      success: false,
      message: message,
      code: status,
      error: err
    };
    logger.info('----------------------------- Error : ', err)
    res.status(500).json(errorResponse)
  });

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

function normalizePort(val: number | string): number | string | boolean {
  const port: number = typeof val === 'string' ? parseInt(val, 10) : val;
  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  } else {
    return false;
  }
}

function onError(error: CustomError): void {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

async function onListening() {
    const addr: any = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    db.raw(`SELECT 'connected' AS connected`).catch((err: any) => {
      logger.error('Connection database failure : ', err)
      process.exit(1)
    })
    
    logger.info('Connected database : ', process.env.DB_DATABASE)
    logger.info('SERVER', process.env.NODE_ENV)
    logger.info(`Server Listening on ${bind}`)
}

main();