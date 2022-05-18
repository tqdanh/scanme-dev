import * as http from 'http';
import * as https from 'https';
import {App} from './app';
import config from './config';
import {logger} from './core';
import {credentials} from './credentials';
const mongoUrl = process.env.MONGO_URL || config.MONGO.URL;
const database = process.env.MONGO_DB || config.MONGO.DB;
const poolSize = process.env.MONGO_POOL_SIZE || config.MONGO.POOL_SIZE;
const bigchainConfig = {'API_PATH': config.BIGCHAIN.API_PATH,
    'app_id': config.BIGCHAIN.APP_ID,
    'app_key': config.BIGCHAIN.APP_KEY
};
const sendGridApiKey = process.env.SENDGRID_API_KEY || config.MAIL.SENDGRID_API_KEY;
const fromEmail = process.env.MAIL_FROM_EMAIL || config.MAIL.FROM_EMAIL;
const DOMAIN = process.env.DOMAIN || config.DOMAIN;
const HTTP_PORT = process.env.HTTP_PORT || config.HTTP_PORT || 3001;
const HTTPS_SECURE = process.env.HTTPS_SECURE || config.HTTPS_SECURE;
const maxPasswordAge = process.env.MAX_PASSWORD_AGE || config.AUTHENTICATION.MAX_PASSWORD_AGE;
const passcodeConfirmUserExpires = process.env.PASSCODE_CONFIRM_USER_EXPIRES || config.PASSCODE_CONFIRM_USER.EXPIRES;
const blacklistTokenKeyPrefix = process.env.BLACKLIST_TOKEN_KEY_PREFIX || config.AUTHENTICATION.BLACKLIST_TOKEN_KEY_PREFIX;
const tokenSecret = process.env.TOKEN_SECRET || config.AUTHENTICATION.TOKEN_SECRET;
const tokenExpires: number = parseInt(process.env.TOKEN_EXPIRES, 10) || config.AUTHENTICATION.TOKEN_EXPIRES;
let encryptPasswordKey: any = false;
/* istanbul ignore else */
if (process.env.ENCRYPT_PASSWORD_KEY) {
    encryptPasswordKey = process.env.ENCRYPT_PASSWORD_KEY;
} else if (config.AUTHENTICATION && config.AUTHENTICATION.ENCRYPT_PASSWORD_KEY && config.AUTHENTICATION.ENCRYPT_PASSWORD_KEY.length > 0) {
    encryptPasswordKey = config.AUTHENTICATION.ENCRYPT_PASSWORD_KEY;
}

const app = new App(
    mongoUrl,
    database,
    poolSize,
    bigchainConfig,
    config.REDIS.URL,
    HTTP_PORT,
    HTTPS_SECURE,
    sendGridApiKey,
    fromEmail,
    DOMAIN,
    passcodeConfirmUserExpires,
    maxPasswordAge,
    encryptPasswordKey,
    blacklistTokenKeyPrefix,
    tokenSecret,
    tokenExpires
);

let server;
if (config.HTTPS_SECURE) {
    server = https.createServer(credentials, app.getApp()).listen(HTTP_PORT, () => {
        console.log('HTTPS Express server listening on port ' + HTTP_PORT);
    });
} else {
    server = http.createServer(app.getApp()).listen(HTTP_PORT, () => {
        console.log('HTTP Express server listening on port ' + HTTP_PORT);
    });
}

export default server;
