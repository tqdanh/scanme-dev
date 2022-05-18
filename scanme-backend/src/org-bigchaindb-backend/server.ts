import * as http from 'http';
import * as https from 'https';

import config from '../config';
import {credentials} from '../credentials';
import {App} from './app';

const DOMAIN = process.env.DOMAIN || config.DOMAIN;
const HTTP_PORT = process.env.HTTP_PORT || config.HTTP_PORT || 3001;
const HTTPS_SECURE = process.env.HTTPS_SECURE || config.HTTPS_SECURE;

const mongoUrl = process.env.MONGO_URL || config.MONGO.URL;
const database = process.env.MONGO_DB || config.MONGO.DB;
const poolSize = process.env.MONGO_POOL_SIZE || config.MONGO.POOL_SIZE;

const maxPasswordAge = process.env.MAX_PASSWORD_AGE || config.AUTHENTICATION.MAX_PASSWORD_AGE;

const sendGridApiKey = process.env.SENDGRID_API_KEY || config.MAIL.SENDGRID_API_KEY;
const fromEmail = process.env.MAIL_FROM_EMAIL || config.MAIL.FROM_EMAIL;
const passcodeConfirmUserExpires = process.env.PASSCODE_CONFIRM_USER_EXPIRES || config.PASSCODE_CONFIRM_USER.EXPIRES;

let encryptPasswordKey: any = false;
/* istanbul ignore else */
if (process.env.ENCRYPT_PASSWORD_KEY) {
  encryptPasswordKey = process.env.ENCRYPT_PASSWORD_KEY;
} else if (config.AUTHENTICATION && config.AUTHENTICATION.ENCRYPT_PASSWORD_KEY && config.AUTHENTICATION.ENCRYPT_PASSWORD_KEY.length > 0) {
  encryptPasswordKey = config.AUTHENTICATION.ENCRYPT_PASSWORD_KEY;
}

export default new Promise((resolve, reject) => {
  const app = new App();
  app.init(
    mongoUrl,
    database,
    poolSize,
    sendGridApiKey,
    fromEmail,
    DOMAIN,
    HTTP_PORT,
    HTTPS_SECURE,
    passcodeConfirmUserExpires,
    maxPasswordAge,
    encryptPasswordKey
  ).subscribe(() => {
    let server;

    /* istanbul ignore if */
    if (config.HTTPS_SECURE) {
      server = https.createServer(credentials, app.getApp());
      server.listen(HTTP_PORT, () => {
        console.log('HTTPS Express server listening on port ' + HTTP_PORT);
        resolve(server);
      });
    } else {
      server = http.createServer(app.getApp());
      server.listen(HTTP_PORT, () => {
        console.log('HTTP Express server listening on port ' + HTTP_PORT);
        resolve(server);
      });
    }
  }, error => {
    reject(error);
  });
});
