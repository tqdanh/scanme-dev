import ProcessEnv = NodeJS.ProcessEnv;
import {StringUtil} from './StringUtil';
import {logger} from '../logging/logger';

export class ConfigUtil {
  private static isNumberRegex = new RegExp(/^([0-9]+)(\.)?([0-9]+)?$/);

  public static mergeWithEnvironment(config: any, env: ProcessEnv): any {
    return ConfigUtil.mergeWithEnvironmentAndPath({...config}, env, null);
  }

  protected static mergeWithEnvironmentAndPath(config: any, env: ProcessEnv, parentPath: string) {
    const keys = Object.keys(config);
    for (const key of keys) {
      const envKey = ConfigUtil.buildFullPathEnv(parentPath, key);
      const envValue = env[envKey];

      switch (typeof config[key]) {
        case 'object':
          // NOTE: With config is Array type, ENV value must following JSON string format to method can parse.
          // Example: STRING_ARRAY=\"[\"1\", \"2\"]\" or OBJECT_ARRAY=\"[{\"key\":\"value1\"}, {\"key\":\"value2\"}]\"
          if (Array.isArray(config[key])) {
            try {
              const newArray = JSON.parse(envValue);
              if (typeof newArray === 'object' && Array.isArray(newArray)) {
                config[key] = newArray;
              }
            } catch (e) {
              console.log('Can\'t parse value of ' + envKey + ' env', e);
            }
          } else if (config[key] !== null) {
            config[key] = ConfigUtil.mergeWithEnvironmentAndPath(config[key], env, envKey);
          }
          break;
        case 'boolean':
          config[key] = env[envKey] === 'true'; break;
        case 'number':
          if (ConfigUtil.isNumberRegex.test(envValue)) {
            config[key] = StringUtil.isEmpty(envValue) ? config[key] : Number(envValue.replace(/^0+/, ''));
          }
          break;
        case 'string':
          config[key] = !envValue ? config[key] : envValue; break;
        default:
          // console.warn('Detected new typeOf, ConfigUtil.mergeWithEnvironmentAndPath() need update code' , envKey, typeof config[key]);
          break;
      }
    }
    logger.debug(config);
    return config;
  }

  private static buildFullPathEnv(parentPath: string, key: string): string {
    if (StringUtil.isEmpty(parentPath)) {
      return key.toUpperCase();
    } else {
      return parentPath + '_' + key.toUpperCase();
    }
  }
}
