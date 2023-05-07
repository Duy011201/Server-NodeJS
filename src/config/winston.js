import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Constant from "../common/constant.js";
import { Writable } from "stream";
import 'winston-daily-rotate-file';

dotenv.config();

const stream = new Writable({
  objectMode: false,
  write: (raw) => console.log("stream msg >>>", raw.toString()),
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default winston.createLogger({
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    winston.format.colorize(),
    winston.format.printf((log) => {
      if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
      return `[${log.timestamp}] [${log.level}] ${log.message}`;
    })
  ),

  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      level: 'error',
      format: winston.format.printf((log) => {
        const logLevel = log.level;
        return `${log.timestamp}:${logLevel}:${log.message}`;
      }),
      // filename: path.join(__dirname, 'errors.log'),
      filename: 'errors.log',
      maxsize: 5242880,
    }),
    new winston.transports.Http({
      host: "localhost",
      port: process.env.PORT || Constant.PORT_SECONDARY,
    }),
    new winston.transports.Stream({ stream }),
    // deploy to production
    // new winston.transports.DailyRotateFile({
    //   filename: path.join(__dirname, 'errors-%DATE%.log'),
    //   datePattern: 'YYYY-MM-DD',
    //   maxFiles: '14d',
    // })
  ],
});
