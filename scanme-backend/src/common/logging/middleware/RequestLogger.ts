import * as humanize from 'humanize-number';

const time = (delta) => {
  return humanize(delta < 10000
    ? delta + 'ms'
    : Math.round(delta / 1000) + 's');
};

const defaultOpts = {
  requestBody: true,
  requestLevel: 'info',
  responseBody: true,
  responseLevel: 'info',
};

export const requestLogger = (logger, opts = {}) => {
  const options = Object.assign({}, defaultOpts, opts);
  return async (req, res, next) => {
    const start = Date.now();

    const reqBody = req.body;
    const reqPath = `${req.method} ${req.path}`;
    if (options.requestBody && reqBody) {
      logger.log(options.requestLevel, `Entering ${reqPath}`, {body: reqBody});
    } else {
      logger.log(options.requestLevel, `Entering ${reqPath}`);
    }

    req.on('close', () => {
      if (options.requestBody && reqBody) {
        logger.error(`Client closed request ${reqPath}`, {body: reqBody});
      } else {
        logger.error(`Client closed request ${reqPath}`);
      }
    });

    // Copy response body for logging
    const original_write = res.write,
      original_end = res.end,
      chunks = [];
    res.write = function (chunk) {
      chunks.push(chunk);
      original_write.apply(res, arguments);
    };
    res.end = function (chunk) {
      if (chunk) {
        chunks.push(chunk);
      }
      original_end.apply(res, arguments);
      let fields;
      // Logging
      const delta = Date.now() - start;
      if (options.responseBody) {
        try {
          let body = Buffer.concat(chunks).toString('utf-8');
          body = JSON.parse(body);
          fields = {statusCode: res.statusCode, responseTime: delta, body};
        } catch (e) {
        }
      } else {
        fields = {statusCode: res.statusCode, responseTime: delta};
      }
      logger.log(options.responseLevel, `Exiting ${reqPath} ${res.statusCode} ${time(delta)}`, fields);
    };

    next();
  };
};
