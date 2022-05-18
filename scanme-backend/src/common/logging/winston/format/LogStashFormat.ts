import jsonStringify from 'fast-safe-stringify';
import {MESSAGE} from 'triple-beam';
import {format} from 'winston';

export const LogStashFormat = format((info) => {
  const {message, timestamp, ...others} = info;
  info[MESSAGE] = jsonStringify({'@message': message, '@timestamp': timestamp, ...others});
  return info;
});
