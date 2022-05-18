import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';

export class JsonWebTokenUtil {
  public static generateToken(jwt, payload: any, secret: string, expiresIn: number): Observable<string> {
    return fromPromise(new Promise<string>(((resolve, reject) => {
      jwt.sign(payload, secret, {expiresIn}, (err, token: string) => err ? reject(err) : resolve(token));
    })));
  }

  public static verifyToken(jwt, token: string, secret: string): Observable<object> {
    return fromPromise(new Promise<object>(((resolve, reject) => {
      jwt.verify(token, secret, (err, payload: object) => err ? reject(err) : resolve(payload));
    })));
  }
}
