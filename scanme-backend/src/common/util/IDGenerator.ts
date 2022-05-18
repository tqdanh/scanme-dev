import * as crypto from 'crypto';
import moment = require('moment');
import * as uuidv4 from 'uuid/v4';

export class IDGenerator {
  private static numChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  private static format_string = 'YYYYMMDDHHmmss';

  public static genID20Digits(appID: string): string {
    let sb = appID;
    sb += moment(new Date()).format(this.format_string);
    sb += IDGenerator.randomNumber(3);
    return sb.toString();
  }

  public static randomNumber(digit: number): string {
    let sb = '';
    for (let i = 0; i < digit; i ++) {
        sb += this.numChars[Math.round(Math.random() * (this.numChars.length - 1))];
    }
    return sb.toString();
  }

  public static generateUniqueID() {
    return crypto.createHash('sha256').update(uuidv4()).digest('hex').toUpperCase();
  }
}
