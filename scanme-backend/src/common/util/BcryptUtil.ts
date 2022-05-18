import {bindCallback, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class BcryptUtil {
  public static compare(bcrypt, v1, v2): Observable<boolean> {
    const compare = (callback) => {
      bcrypt.compare(v1, v2, function (err, valid) {

        return callback(err, valid);
      });
    };
    return bindCallback(compare).apply(valid => valid).pipe(map(valid => {
      return !!valid[1];
    }));
  }

  public static getRandomString(max: number): string {
    return this.padLeft(Math.floor(Math.random() * Math.floor(Math.pow(10, max) - 1)).toString(), max, '0');
  }

  private static padLeft(str, length, pad) {
    if (!str) {
      return str;
    }
    if (typeof str !== 'string') {
      str = '' + str;
    }
    if (str.length >= length) {
      return str;
    }
    if (!pad) {
      pad = ' ';
    }
    let str2 = str;
    while (str2.length < length) {
      str2 = pad + str2;
    }
    return str2;
  }

  public static generateHashCode(bcrypt, text: string): Observable<string> {
    const saltRounds = 10;
    const generated = (callback) => {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
          return callback(err, null);
        }
        bcrypt.hash(text, salt, function (err1, hash) {
          if (err1) {
            return callback(err1, null);
          }
          return callback(null, hash);
        });
      });
    };
    return bindCallback(generated).apply(item => {
      return item;
    }).pipe(map(item => item[1]));
  }
}
