import {Module} from '../Module';

export class PermissionUtil {
  public static existLink(modules: Module[], link: string): boolean {
    const splitString = link.trim().split('/');
    let result;
    if (splitString.length > 0) {
      result = splitString[0] + '/' + splitString[1] + '/' + splitString[2] + '/' + splitString[3];
    }
    for (const module of modules) {
      for (const item of module.modules) {
        if (item.link === result) {
          return true;
        }
      }
    }
    return false;
  }
}
