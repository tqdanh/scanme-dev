import {Response} from 'express';
import {JsonUtil} from '../../util/JsonUtil';

export class ResponseUtil {
  public static noCache(res: Response) {
    res.header('Access-Control-Max-Age', '0');
    res.header('Cache-Control', 'max-age=0,no-cache,no-store,post-check=0,pre-check=0,must-revalidate');
    res.header('Expires', '-1');
  }
  public static succeed(res: Response, obj: any) {
    this.noCache(res);
    JsonUtil.minimizeJson(obj);
    res.status(200).json(obj);
  }
  public static error(res: Response, err: any) {
    console.log(err);
    res.status(500).send(err);
  }
}
