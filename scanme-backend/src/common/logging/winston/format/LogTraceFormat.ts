import {getNamespace} from 'cls-hooked';
import {format} from 'winston';

export const LogTraceFormat = format((info, opts) => {
  const ns = getNamespace('context');
  if (ns) {
    info.mobileNo = ns.get('mobileNo');
    info.corrId = ns.get('corrId');
  }
  info.service = opts.service;
  return info;
});
