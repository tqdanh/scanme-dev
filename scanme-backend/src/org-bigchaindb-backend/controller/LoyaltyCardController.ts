import {Request, Response} from 'express';
import {ResponseUtil} from '../../common/controller/util/ResponseUtil';
import {MetadataUtil} from '../../common/metadata/util/MetadataUtil';
import {JsonUtil} from '../../common/util/JsonUtil';
import {GetItemModel} from '../model/GetItemModel';
import {GetLoyaltyCardModel} from '../model/GetLoyaltyCardModel';
import {GetOrgModel} from '../model/GetOrgModel';
import {GetProductsModel} from '../model/GetProductsModel';
import {ItemService} from '../service/ItemService';
import {LoyaltyCardService} from '../service/LoyaltyCardService';
import {OrganizationService} from '../service/OrganizationService';
import {ProductsService} from '../service/ProductsService';

export class LoyaltyCardController {
  constructor(private loyaltyCardService: LoyaltyCardService) {
  }

  private handleError(res: Response, error: Error) {
    if (error instanceof ClientError) {
      res.status(400).end('The Client Error: ' + error);
    } else {
      console.error(error.stack);
      res.status(500).end('The Internal Server Error: ' + error.message);
    }
  }

  getLoyaltyCardByOwnerId(req: Request, res: Response) {
    const ownerId = req.query.ownerId;
    if (!ownerId) {
      throw new ClientError('No owner Id');
    }
    // Set data
    let getLoyaltyCardModel: GetLoyaltyCardModel;
    try {
      getLoyaltyCardModel = this.setDataGetLoyaltyCardModel(req.query);
    } catch (err) {
      throw new ClientError(err);
    }
    // Call service
    console.log('getItem: ' + JSON.stringify(getLoyaltyCardModel));
    return this.loyaltyCardService.getLoyaltyCardByOwnerId(getLoyaltyCardModel, ownerId).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }


  private setDataGetLoyaltyCardModel(request) {
    const getLoyaltyCardModel = new GetLoyaltyCardModel();
    getLoyaltyCardModel._id = request.id || null;
    getLoyaltyCardModel.cardNumber = request.cardNumber || null;
    getLoyaltyCardModel.orgId = request.orgId || null;
    getLoyaltyCardModel.ownerId = request.ownerId || null;
    getLoyaltyCardModel.type = parseInt(request.type, 10);
    getLoyaltyCardModel.sortField = request.sortField || null;
    getLoyaltyCardModel.sortType = request.sortType || 'ASC';
    getLoyaltyCardModel.pageIndex = Number(request.pageIndex) || 1;
    getLoyaltyCardModel.pageSize = Number(request.pageSize) || 3;
    return getLoyaltyCardModel;
  }

  getLoyaltyCardByCardNumber(req: Request, res: Response) {
    // Set data
    const cardNumber = req.query.cardNumber;
    if (!cardNumber) {
      throw new ClientError('No cardNumber Id');
    }
    // Call service
    return this.loyaltyCardService.getLoyaltyCardByCardNumber(cardNumber).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }

  getLoyaltyCardByOrgId(req: Request, res: Response) {
    // Set data
    const orgId = req.query.orgId;
    if (!orgId) {
      throw new ClientError('No org Id');
    }
    // Call service
    return this.loyaltyCardService.getLoyaltyCardByOrgId(orgId).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }

  getConsumerByOrgId(req: Request, res: Response) {
    // Set data
    const orgId = req.query.orgId;
    if (!orgId) {
      throw new ClientError('No org Id');
    }
    // Call service
    return this.loyaltyCardService.getConsumerByOrgId(orgId).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }

  getLoyaltyCardByOwnerIdMobile(req: Request, res: Response) {
    // Set data
    const ownerId = req.query.ownerId;
    if (!ownerId) {
      throw new ClientError('No owner Id');
    }
    // Call service
    return this.loyaltyCardService.getLoyaltyCardByOwnerIdMobile(ownerId).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }

  insert(req: Request, res: Response) {
    const obj = req.body;
    if (!obj || obj === '') {
      res.status(400).end('The request body cannot be empty.');
    } else {
      this.loyaltyCardService.insert(obj).subscribe(
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
      const metadata = MetadataUtil.getMetaModel(this.loyaltyCardService.getMetaData());
      if (metadata.primaryKeys.length === 1) {
        const id = req.params.id;
        if (!id || id === '') {
          return res.status(400).end('Id cannot be empty.');
        }
      }
      this.loyaltyCardService.update(obj).subscribe(
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


    // {
    //   "loyaltyCardId": "5dca535ccd653543c0eb3229",
    //   "items": [
    //       {
    //         "itemId": "5d79eec8abcc3d43300bbe9d",
    //         "scanDate": "2019-11-20",
    //         "location": [
    //             "10.840618",
    //             "106.765229"
    //             ]
    //       }
    //       ]
    // }
  updateLoyaltyCardById(req: Request, res: Response) {
    const obj = req.body;
    if (!obj || obj === '') {
      res.status(400).end('The request body cannot be empty.');
    } else {
      this.loyaltyCardService.updateLoyaltyCard(obj, obj.loyaltyCardId).subscribe(
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
    const metadata = MetadataUtil.getMetaModel(this.loyaltyCardService.getMetaData());
    const id = (metadata.primaryKeys.length === 1 ? req.params.id : req.body);
    if (!id || id === '') {
      res.status(400).end('Id cannot be empty.');
    } else {
      this.loyaltyCardService.delete(id).subscribe(
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

  existLoyaltyCard(req: Request, res: Response) {
    this.loyaltyCardService.existLoyaltyCard(req.query.ownerId, req.query.orgId).subscribe(
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

class ClientError extends Error {
  constructor(message: string) {
    super(message);
  }
}
