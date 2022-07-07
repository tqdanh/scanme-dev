import {ConfigUtil} from './common/util/ConfigUtil';

const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        DOMAIN: '172.16.4.132',
        HTTP_PORT: 8080,
        HTTPS_SECURE: false,
        MONGO: {
            URL: 'mongodb://172.16.4.132:27017',
            DB: 'supplychain',
            POOL_SIZE: 5,
        },
        BIGCHAIN: {
            API_PATH: 'http://172.16.4.132:9984/api/v1/',
            APP_ID: '218747a2',
            APP_KEY: '717a15fc4fa5386a15f5ff576e2a9e28',
        },
        REDIS: {
            URL: 'redis://172.16.4.132:6379'
        },
        AUTHENTICATION: {
            MAX_PASSWORD_AGE: 90, // day
            BLACKLIST_TOKEN_KEY_PREFIX: 'auth-blacklist-token',
            ENCRYPT_PASSWORD_KEY: 'secretKey',
            TOKEN_SECRET: 'secrettma',
            TOKEN_EXPIRES: 7 * 24 * 60 * 60 * 1000 // 1H
        },
        MAIL: {
            // SENDGRID_API_KEY: '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',
            // FROM_EMAIL: 'htp1912@gmail.com'
            SENDGRID_API_KEY: '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',
            FROM_EMAIL: 'quochung2308@gmail.com'
        },
        PASSCODE_CONFIRM_USER: {
            EXPIRES: 3600 * 24 // 1 day
        },
        FILE_STORAGE_PATH: 'C:/Users/votan/Documents/GitHub/trustme/file-container'
    },
    production: {
        DOMAIN: '192.168.75.88',
        HTTP_PORT: 8080,
        HTTPS_SECURE: false,
        MONGO: {
            URL: 'mongodb://192.168.75.88:27017',
            DB: 'supplychain',
            POOL_SIZE: 5,
        },
        BIGCHAIN: {
            API_PATH: 'http://192.168.75.88:9984/api/v1/',
            APP_ID: '218747a2',
            APP_KEY: '717a15fc4fa5386a15f5ff576e2a9e28',
        },
        REDIS: {
            URL: 'redis://192.168.75.88:6379'
        },
        AUTHENTICATION: {
            MAX_PASSWORD_AGE: 90, // day
            BLACKLIST_TOKEN_KEY_PREFIX: 'auth-blacklist-token',
            ENCRYPT_PASSWORD_KEY: 'secretKey',
            TOKEN_SECRET: 'secrettma',
            TOKEN_EXPIRES: 60 * 60 * 1000 // 1H
        },
        MAIL: {
            // SENDGRID_API_KEY: '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',
            // FROM_EMAIL: 'htp1912@gmail.com'
            SENDGRID_API_KEY: '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',
            FROM_EMAIL: 'quochung2308@gmail.com'

        },
        PASSCODE_CONFIRM_USER: {
            EXPIRES: 3600 * 24 // 1 day
        },
        FILE_STORAGE_PATH: 'C:/Users/votan/Documents/GitHub/trustme/file-container'
    }
};

const configMerged = ConfigUtil.mergeWithEnvironment(config[env], process.env);
export default configMerged;
