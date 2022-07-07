import * as fs from 'fs';
import * as multer from 'multer';
import * as path from 'path';

import { Request, Response } from 'express';

import { GetOrgModel } from '../model/GetOrgModel';
import { GetProductsModel } from '../model/GetProductsModel';
import { JsonUtil } from '../../common/util/JsonUtil';
import { MetadataUtil } from '../../common/metadata/util/MetadataUtil';
import { OrganizationService } from '../service/OrganizationService';
import { ProductsService } from '../service/ProductsService';
import { ResponseUtil } from '../../common/controller/util/ResponseUtil';
import config from '../../config';

export class ProductsController {
  constructor(private productsService: ProductsService) {
  }

  uploadImage(req: any, res: Response) {
    const destination = path.join(config.FILE_STORAGE_PATH, req.body.path);
    const fileName = req.body.name;

    fs.mkdir(destination, { recursive: true }, (err) => {
      if (err) {
        console.log(err);
      } else {
        fs.writeFile(path.join(destination, fileName), req.file.buffer, err => {
          if (err) {
            console.log(err);
          }
        });
      }
    });

    res.status(200).json({ success: true });
  }

  downloadImage(req: Request, res: Response) {
    const file = path.join(config.FILE_STORAGE_PATH, req.params[0]);
    res.download(file, err => {
      if (err) {
        res.sendStatus(404);
      }
    });
  }

  private handleError(res: Response, error: Error) {
    if (error instanceof ClientError) {
      res.status(400).end('The Client Error: ' + error);
    } else {
      console.error(error.stack);
      res.status(500).end('The Internal Server Error: ' + error.message);
    }
  }

  getProducts(req: Request, res: Response) {
    const orgId = req.query.orgId;
    if (!orgId) {
      throw new ClientError('No organization Id');
    }
    // Set data
    let getProductsModel: GetProductsModel;
    try {
      getProductsModel = this.setDataGetProductsModel(req.query);
    } catch (err) {
      throw new ClientError(err);
    }
    // Call service
    console.log('getProducts: ' + JSON.stringify(getProductsModel));
    return this.productsService.getProducts(getProductsModel, orgId).subscribe(
      resData => res.status(200).json(resData),
      err => this.handleError(res, err)
    );
  }

  private setDataGetProductsModel(request) {
    const getOrgModel = new GetProductsModel();
    getOrgModel._id = request._id || null;
    getOrgModel.name = request.name || null;
    getOrgModel.status = parseInt(request.status, 10);
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
    return this.productsService.getProductById(productId).subscribe(
      resData => res.status(200).json(resData),
      err => this.handleError(res, err)
    );
  }

  getProductByOrgId(req: Request, res: Response) {
    // Set data
    const orgId = req.query.orgId;
    if (!orgId) {
      throw new ClientError('No organization Id');
    }
    // Call service
    return this.productsService.getProductByOrgId(orgId).subscribe(
      resData => res.status(200).json(resData),
      err => this.handleError(res, err)
    );
  }

  insert(req: Request, res: Response) {
    const obj = req.body;
    if (!obj || obj === '') {
      return res.status(400).end('The request body cannot be empty.');
    } else {
      this.productsService.insert(obj).subscribe(
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

  insertList(req: Request, res: Response) {
    const obj = req.body;
    if (!obj || obj === []) {
      return res.status(400).end('The request body cannot be empty.');
    } else {
      this.productsService.insertList(obj).subscribe(
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
      const metadata = MetadataUtil.getMetaModel(this.productsService.getMetaData());
      if (metadata.primaryKeys.length === 1) {
        const id = req.params.id;
        if (!id || id === '') {
          return res.status(400).end('Id cannot be empty.');
        }
      }
      this.productsService.update(obj).subscribe(
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
    const metadata = MetadataUtil.getMetaModel(this.productsService.getMetaData());
    const id = (metadata.primaryKeys.length === 1 ? req.params.id : req.body);
    if (!id || id === '') {
      res.status(400).end('Id cannot be empty.');
    } else {
      //@ts-ignore
      fs.rmdir(`${config.FILE_STORAGE_PATH}/product/${id}`, { recursive: true, force: true }, err => {
        if (err) {
          console.log(err);
        }
      });
      this.productsService.delete(id).subscribe(
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
