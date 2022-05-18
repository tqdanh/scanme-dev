import * as http from 'http';

import {logger} from '../common/logging/logger';
import config from '../config';
import {App} from './app';

const PORT = process.env.HTTP_PORT || config.HTTP_PORT || 3001;

const tokenSecret = process.env.TOKEN_SECRET || config.AUTHENTICATION.TOKEN_SECRET;
const tokenExpires: number = parseInt(process.env.TOKEN_EXPIRES, 10) || config.AUTHENTICATION.TOKEN_EXPIRES;
const blacklistTokenKeyPrefix = process.env.BLACKLIST_TOKEN_KEY_PREFIX || config.AUTHENTICATION.BLACKLIST_TOKEN_KEY_PREFIX;
const bigchainConfig = {'API_PATH': config.BIGCHAIN.API_PATH,
                        'app_id': config.BIGCHAIN.APP_ID,
                        'app_key': config.BIGCHAIN.APP_KEY
                      };

const app = new App(bigchainConfig, config.MONGO.URL, config.MONGO.DB, config.MONGO.POOL_SIZE, config.REDIS.URL, blacklistTokenKeyPrefix, tokenSecret, tokenExpires);

const server = http.createServer(app.getApp()).listen(PORT, () => {
  logger.info('HTTP Express server listening on port ' + PORT);
});
