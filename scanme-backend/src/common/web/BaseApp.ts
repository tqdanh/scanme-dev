import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import {Application} from 'express';

export class BaseApp {
  protected app: Application;
  public getApp(): Application {
    return this.app;
  }

  constructor() {
    this.app = express();
    this.config();
  }

  protected config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
    // serving static files
    this.app.use(express.static('public'));
  }
}
