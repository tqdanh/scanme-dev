import {Request, Response} from 'express';
import {ResponseUtil} from '../../common/controller/util/ResponseUtil';
import {MetadataUtil} from '../../common/metadata/util/MetadataUtil';
import {JsonUtil} from '../../common/util/JsonUtil';
import {GetItemModel} from '../model/GetItemModel';
import {GetOrgModel} from '../model/GetOrgModel';
import {GetProductsModel} from '../model/GetProductsModel';
import {ItemService} from '../service/ItemService';
import {OrganizationService} from '../service/OrganizationService';
import {ProductsService} from '../service/ProductsService';

export class ItemController {
  constructor(private itemService: ItemService) {
  }

  private handleError(res: Response, error: Error) {
    if (error instanceof ClientError) {
      res.status(400).end('The Client Error: ' + error);
    } else {
      console.error(error.stack);
      res.status(500).end('The Internal Server Error: ' + error.message);
    }
  }

  getItem(req: Request, res: Response) {
    const productCatId = req.query.productCatId;
    if (!productCatId) {
      throw new ClientError('No product category Id');
    }
    // Set data
    let getItemModel: GetItemModel;
    try {
      getItemModel = this.setDataGetItemModel(req.query);
    } catch (err) {
      throw new ClientError(err);
    }
    // Call service
    console.log('getItem: ' + JSON.stringify(getItemModel));
    return this.itemService.getItem(getItemModel, productCatId).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }


  private setDataGetItemModel(request) {
    const getItemModel = new GetItemModel();
    getItemModel._id = request._id || null;
    getItemModel.mfg = request.mfg || null;
    getItemModel.exp = request.exp || null;
    getItemModel.lot = request.lot || null;
    getItemModel.actionCode = parseInt(request.actionCode, 10);
    getItemModel.sortField = request.sortField || null;
    getItemModel.sortType = request.sortType || 'ASC';
    getItemModel.pageIndex = Number(request.pageIndex) || 1;
    getItemModel.pageSize = Number(request.pageSize) || 3;
    return getItemModel;
  }

  getItemById(req: Request, res: Response) {
    // Set data
    const itemId = req.query.id;
    if (!itemId) {
      throw new ClientError('No item Id');
    }
    // Call service
    return this.itemService.getItemById(itemId).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }

  getItemByProductCatId(req: Request, res: Response) {
    // Set data
    const productCatId = req.query.productCatId;
    if (!productCatId) {
      throw new ClientError('No product category Id');
    }
    // Call service
    return this.itemService.getItemByProductCatId(productCatId).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }

  insert(req: Request, res: Response) {
    const obj = req.body;
    if (!obj || obj === '') {
      res.status(400).end('The request body cannot be empty.');
    } else {
      this.itemService.insert(obj).subscribe(
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

  insertObjects(req: Request, res: Response) {
    const obj = req.body;
    if (!obj || obj === '') {
      res.status(400).end('The request body cannot be empty.');
    } else {
      this.itemService.insertObjects(obj).subscribe(
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

  updateObjects(req: Request, res: Response) {
    const obj = req.body;
    if (!obj || obj === '') {
      res.status(400).end('The request body cannot be empty.');
    } else {
      this.itemService.updateObjects(obj).subscribe(
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
      const metadata = MetadataUtil.getMetaModel(this.itemService.getMetaData());
      if (metadata.primaryKeys.length === 1) {
        const id = req.params.id;
        if (!id || id === '') {
          return res.status(400).end('Id cannot be empty.');
        }
      }
      this.itemService.update(obj).subscribe(
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
    const metadata = MetadataUtil.getMetaModel(this.itemService.getMetaData());
    const id = (metadata.primaryKeys.length === 1 ? req.params.id : req.body);
    if (!id || id === '') {
      res.status(400).end('Id cannot be empty.');
    } else {
      this.itemService.delete(id).subscribe(
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

  deleteByIds(req: Request, res: Response) {
    const obj = req.body;
    if (!obj || obj === '') {
      res.status(400).end('The request body cannot be empty.');
    } else {
      this.itemService.deleteByIds(obj).subscribe(
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

}

class ClientError extends Error {
  constructor(message: string) {
    super(message);
  }
}
