import {createLogger, format, transports} from 'winston';
import { LogStashFormat } from './winston/format/LogStashFormat';
import { LogTraceFormat } from './winston/format/LogTraceFormat';
import { SimpleFormat } from './winston/format/SimpleFormat';

const { combine, timestamp } = format;

export const logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    LogTraceFormat({service: process.env.SERVICE}),
    process.env.NODE_ENV === 'development' ? SimpleFormat() : LogStashFormat()
  ),
  transports: [
    new transports.Console()
  ]
});
