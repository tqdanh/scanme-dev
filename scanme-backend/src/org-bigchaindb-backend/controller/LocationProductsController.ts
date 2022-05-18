import {Request, Response} from 'express';
import * as uuidv4 from 'uuid/v4';
import {AuthorizationToken} from '../../common/AuthorizationToken';
import {ResponseUtil} from '../../common/controller/util/ResponseUtil';
import {MetadataUtil} from '../../common/metadata/util/MetadataUtil';
import {JsonUtil} from '../../common/util/JsonUtil';
import {StringUtil} from '../../common/util/StringUtil';
import {GetOrgModel} from '../model/GetOrgModel';
import {LocationProducts} from '../model/LocationProducts';
import {LocationProductsService} from '../service/LocationProductsService';

export class LocationProductsController {
  constructor(private locationProductsService: LocationProductsService) {
  }

  private handleError(res: Response, error: Error) {
    if (error instanceof ClientError) {
      res.status(400).end('The Client Error: ' + error);
    } else {
      console.error(error.stack);
      res.status(500).end('The Internal Server Error: ' + error.message);
    }
  }

  getLocationProductsByOrgId(req: Request, res: Response) {
    // Get authentication token
    const authenticationToken: AuthorizationToken = res.locals.authorizationToken;
    // Set data
    let orgId;
    let startDate;
    let endDate;
    try {
      if (authenticationToken) {
        orgId = authenticationToken.providerId;
      } else {
        orgId = req.query.orgId;
      }
      startDate = req.query.startDate;
      endDate = req.query.endDate;
    } catch (err) {
      throw new ClientError(err);
    }
    // Call service
    console.log('getLocationProductsByOrgId: ' + JSON.stringify(orgId));
    return this.locationProductsService.getLocationProductsByOrgId(orgId, startDate, endDate).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }


  countLocationProductsByTxId(req: Request, res: Response) {
    // Set data
    const transactionId = req.query.transactionId;
    // Call service
    console.log('countLocationProductsByTxId: ' + JSON.stringify(transactionId));
    return this.locationProductsService.getLocationProductsByTxId(transactionId).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }


  private setDataGetOrgModel(request) {
    const getOrgModel = new GetOrgModel();
    getOrgModel.name = request.name || null;
    getOrgModel.sortField = request.sortField || null;
    getOrgModel.sortType = request.sortType || 'ASC';
    getOrgModel.pageIndex = Number(request.pageIndex) || 1;
    getOrgModel.pageSize = Number(request.pageSize) || 3;
    return getOrgModel;
  }

  getProductById(req: Request, res: Response) {
    // Set data
    const productId = req.query.id;
    if (!productId) {
      throw new ClientError('No product Id');
    }
    // Call service
    return this.locationProductsService.getLocationProductById(productId).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }

  insert(req: Request, res: Response) {
    const obj = req.body;
    if (!obj || obj === '') {
      res.status(400).end('The request body cannot be empty.');
    } else {
      const locationProduct = new LocationProducts();
      locationProduct.locationProductId = StringUtil.uuid(uuidv4);
      locationProduct.productId = obj.productId;
      const location = [String(obj.scanLocation[0]), String(obj.scanLocation[1])];
      locationProduct.scanLocation = location;
      locationProduct.scanDate = new Date();
      locationProduct.itemId = obj.itemId;
      locationProduct.transactionId = obj.transactionId;
      this.locationProductsService.insert(locationProduct).subscribe(
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
      const metadata = MetadataUtil.getMetaModel(this.locationProductsService.getMetaData());
      if (metadata.primaryKeys.length === 1) {
        const id = req.params.id;
        if (!id || id === '') {
          return res.status(400).end('Id cannot be empty.');
        }
      }
      this.locationProductsService.update(obj).subscribe(
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
    const metadata = MetadataUtil.getMetaModel(this.locationProductsService.getMetaData());
    const id = (metadata.primaryKeys.length === 1 ? req.params.id : req.body);
    if (!id || id === '') {
      res.status(400).end('Id cannot be empty.');
    } else {
      this.locationProductsService.delete(id).subscribe(
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
