import {NextFunction, Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {flatMap, map} from 'rxjs/operators';
import {AuthorizationToken} from '../AuthorizationToken';
import {BlacklistTokenService} from '../service/BlacklistTokenService';
import {JsonWebTokenUtil} from '../util/JsonWebTokenUtil';

class TokenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthenticationHandler {

  constructor(private service: BlacklistTokenService, private tokenSecret: string) {
  }

  checkToken(req: Request, res: Response, next: NextFunction) {
    const data: string = req.headers['authorization'];
    if (!data || data.length === 0) {
      res.status(401).end('Authorization is required.');
    } else if (!data.startsWith('Bearer ')) {
      res.status(401).end('Format is Authorization: Bearer [token]');
    } else {
      const token = data.substr(7);
      JsonWebTokenUtil.verifyToken(jwt, token, this.tokenSecret).pipe(flatMap((authorizationToken: AuthorizationToken) => {
        const createAt = new Date(authorizationToken.iat * 1000);
        return this.service.check(authorizationToken.userId, token, createAt).pipe(map(reason => {
          if (!reason) {
            return authorizationToken;
          } else {
            throw new TokenError(reason);
          }
        }));
      })).subscribe((authorizationToken: AuthorizationToken) => {
        res.locals.authorizationToken = authorizationToken;
        res.locals.token = token;
        next();
      }, error => {
        this.handleError(res, error);
      });
    }
  }

  private handleError(res: Response, error: Error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).end('The token expired.');
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(400).end('The token invalid.');
    } else if (error instanceof TokenError) {
      res.status(401).end('The token has been revoked: ' + error.message);
    } else {
      console.error(error);
      res.status(500).end('Internal Server Error');
    }
  }
}
