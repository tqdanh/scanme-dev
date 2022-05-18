import {Request, Response} from 'express';
import {ResponseUtil} from '../../common/controller/util/ResponseUtil';
import {MetadataUtil} from '../../common/metadata/util/MetadataUtil';
import {JsonUtil} from '../../common/util/JsonUtil';
import {GetGiftModel} from '../model/GetGiftModel';
import {GetItemModel} from '../model/GetItemModel';
import {GetOrgModel} from '../model/GetOrgModel';
import {GetProductsModel} from '../model/GetProductsModel';
import {GiftService} from '../service/GiftService';
import {ItemService} from '../service/ItemService';
import {OrganizationService} from '../service/OrganizationService';
import {ProductsService} from '../service/ProductsService';

export class GiftController {
  constructor(private giftService: GiftService) {
  }

  private handleError(res: Response, error: Error) {
    if (error instanceof ClientError) {
      res.status(400).end('The Client Error: ' + error);
    } else {
      console.error(error.stack);
      res.status(500).end('The Internal Server Error: ' + error.message);
    }
  }

  getGift(req: Request, res: Response) {
    const orgId = req.query.orgId;
    if (!orgId) {
      throw new ClientError('No org Id');
    }
    // Set data
    let getGiftModel: GetGiftModel;
    try {
      getGiftModel = this.setDataGetGiftModel(req.query);
    } catch (err) {
      throw new ClientError(err);
    }
    // Call service
    console.log('getItem: ' + JSON.stringify(getGiftModel));
    return this.giftService.getGift(getGiftModel, orgId).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }


  private setDataGetGiftModel(request) {
    const getGiftModel = new GetGiftModel();
    getGiftModel._id = request._id || null;
    getGiftModel.name = request.name || null;
    getGiftModel.expiryDate = request.expiryDate || null;
    getGiftModel.sortField = request.sortField || null;
    getGiftModel.sortType = request.sortType || 'ASC';
    getGiftModel.pageIndex = Number(request.pageIndex) || 1;
    getGiftModel.pageSize = Number(request.pageSize) || 3;
    return getGiftModel;
  }

  getGiftById(req: Request, res: Response) {
    // Set data
    const giftId = req.query.id;
    if (!giftId) {
      throw new ClientError('No gift Id');
    }
    // Call service
    return this.giftService.getGiftById(giftId).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }

  getGiftByOrgId(req: Request, res: Response) {
    // Set data
    const orgId = req.query.orgId;
    if (!orgId) {
      throw new ClientError('No org Id');
    }
    // Call service
    return this.giftService.getGiftByOrgId(orgId).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }

  insert(req: Request, res: Response) {
    const obj = req.body;
    if (!obj || obj === '') {
      res.status(400).end('The request body cannot be empty.');
    } else {
      this.giftService.insert(obj).subscribe(
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
      const metadata = MetadataUtil.getMetaModel(this.giftService.getMetaData());
      if (metadata.primaryKeys.length === 1) {
        const id = req.params.id;
        if (!id || id === '') {
          return res.status(400).end('Id cannot be empty.');
        }
      }
      this.giftService.update(obj).subscribe(
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
    const metadata = MetadataUtil.getMetaModel(this.giftService.getMetaData());
    const id = (metadata.primaryKeys.length === 1 ? req.params.id : req.body);
    if (!id || id === '') {
      res.status(400).end('Id cannot be empty.');
    } else {
      this.giftService.delete(id).subscribe(
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
