import {of} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import * as uuidv4 from 'uuid/v4';
import {Request, Response} from 'express';
import {ResponseUtil} from '../../common/controller/util/ResponseUtil';
import {MetadataUtil} from '../../common/metadata/util/MetadataUtil';
import {IDGenerator} from '../../common/util/IDGenerator';
import {JsonUtil} from '../../common/util/JsonUtil';
import {StringUtil} from '../../common/util/StringUtil';
import {Consumer} from '../model/Consumer';
import {GetConsumerModel} from '../model/GetConsumerModel';
import {GetItemModel} from '../model/GetItemModel';
import {GetOrgModel} from '../model/GetOrgModel';
import {GetProductsModel} from '../model/GetProductsModel';
import {ConsumerService} from '../service/ConsumerService';
import {ItemService} from '../service/ItemService';
import {OrganizationService} from '../service/OrganizationService';
import {ProductsService} from '../service/ProductsService';

export class ConsumerController {
  constructor(private consumerService: ConsumerService) {
  }

  private handleError(res: Response, error: Error) {
    if (error instanceof ClientError) {
      res.status(400).end('The Client Error: ' + error);
    } else {
      console.error(error.stack);
      res.status(500).end('The Internal Server Error: ' + error.message);
    }
  }

  getConsumer(req: Request, res: Response) {
    // Set data
    let getConsumerModel: GetConsumerModel;
    try {
      getConsumerModel = this.setDataGetConsumerModel(req.query);
    } catch (err) {
      throw new ClientError(err);
    }
    // Call service
    console.log('getConsumer: ' + JSON.stringify(getConsumerModel));
    return this.consumerService.getConsumer(getConsumerModel).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }


  private setDataGetConsumerModel(request) {
    const getConsumerModel = new GetConsumerModel();
    getConsumerModel._id = request.id || null;
    getConsumerModel.fullName = request.name || null;
    getConsumerModel.telephone = request.telephone || null;
    getConsumerModel.idCard = request.idCard || null;
    getConsumerModel.address = request.address || null;
    getConsumerModel.email = request.email || null;
    getConsumerModel.idCard = request.idCard || null;
    getConsumerModel.userId = request.userId || null;
    getConsumerModel.sso = request.sso || null;
    getConsumerModel.sortField = request.sortField || null;
    getConsumerModel.sortType = request.sortType || 'ASC';
    getConsumerModel.pageIndex = Number(request.pageIndex) || 1;
    getConsumerModel.pageSize = Number(request.pageSize) || 3;
    return getConsumerModel;
  }

  getConsumerById(req: Request, res: Response) {
    // Set data
    const consumerId = req.body.userId;
    if (!consumerId) {
      throw new ClientError('No consumerId Id');
    }
    // Call service
    console.log('getConsumerById: ' + JSON.stringify(consumerId));
    return this.consumerService.getConsumerById(consumerId).pipe(flatMap((consumers) => {
      if (consumers) {
        return of(consumers);
      } else {
        const obj = req.body;
        if (!obj || obj === '') {
          res.status(400).end('The request body cannot be empty.');
        } else {
          const consumer = new Consumer();
          consumer.consumerId = StringUtil.uuid(uuidv4);
          consumer.fullName = obj.name || '';
          consumer.telephone = obj.telephone || '';
          // consumer.idCard = obj.idCard || '';
          consumer.idCard = IDGenerator.randomNumber(12);
          consumer.sex = obj.sex || '';
          consumer.birthDay = obj.birthDay || '';
          consumer.address = obj.address || '';
          consumer.email = obj.email || '';
          consumer.userId = obj.userId || '';
          consumer.sso = obj.sso || '';
          return this.consumerService.insert(consumer);
        }
      }
    })).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }

  insert(req: Request, res: Response) {
    const obj = req.body;
    if (!obj || obj === '') {
      res.status(400).end('The request body cannot be empty.');
    } else {
      const consumer = new Consumer();
      consumer.consumerId = StringUtil.uuid(uuidv4);
      consumer.fullName = obj.name || '';
      consumer.telephone = obj.telephone || '';
      // consumer.idCard = IDGenerator.randomNumber(12);
      consumer.idCard = obj.idCard || '';
      consumer.address = obj.address || '';
      consumer.email = obj.email || '';
      consumer.userId = obj.userId || '';
      consumer.sso = obj.sso || '';
      this.consumerService.insert(consumer).subscribe(
          result => {
            JsonUtil.minimizeJson(result);
            return res.status(200).json(result);
          },
          err => {
            ResponseUtil.error(res, err);
          }
      );
    }
  }

  update(req: Request, res: Response) {
    const obj = req.body;
    if (!obj || obj === '') {
      res.status(400).end('The request body cannot be empty.');
    } else {
      const metadata = MetadataUtil.getMetaModel(this.consumerService.getMetaData());
      if (metadata.primaryKeys.length === 1) {
        const id = req.params.id;
        if (!id || id === '') {
          return res.status(400).end('Id cannot be empty.');
        }
      }
      this.consumerService.update(obj).subscribe(
          result => {
            JsonUtil.minimizeJson(result);
            return res.status(200).json(result);
          },
          err => {
            ResponseUtil.error(res, err);
          }
      );
    }
  }

  delete(req: Request, res: Response) {
    const metadata = MetadataUtil.getMetaModel(this.consumerService.getMetaData());
    const id = (metadata.primaryKeys.length === 1 ? req.params.id : req.body);
    if (!id || id === '') {
      res.status(400).end('Id cannot be empty.');
    } else {
      this.consumerService.delete(id).subscribe(
          result => {
            JsonUtil.minimizeJson(result);
            res.status(200).json(result);
          },
          err => {
            ResponseUtil.error(res, err);
          },
      );
    }
  }

}

class ClientError extends Error {
  constructor(message: string) {
    super(message);
  }
}
