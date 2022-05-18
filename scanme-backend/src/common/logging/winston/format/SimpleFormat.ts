import {MESSAGE} from 'triple-beam';
import {format} from 'winston';

export const SimpleFormat = format((info) => {
  const defaultValue = '';
  const mobileNo = info.mobileNo || defaultValue;
  const corrId = info.corrId || defaultValue;
  info[MESSAGE] = `${info.timestamp} - ${info.level.toUpperCase()} ${mobileNo} ${corrId}: ${info.message}`;
  return info;
});
