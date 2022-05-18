import {Request, Response} from 'express';
import {of} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import * as uuidv4 from 'uuid/v4';
import {IDGenerator} from '../../common/util/IDGenerator';
import {JsonUtil} from '../../common/util/JsonUtil';
import {StringUtil} from '../../common/util/StringUtil';
import {Consumer} from '../../org-bigchaindb-backend/model/Consumer';
import {GetOrgModel} from '../../org-bigchaindb-backend/model/GetOrgModel';
import {Item} from '../../org-bigchaindb-backend/model/Item';
import {LocationProducts} from '../../org-bigchaindb-backend/model/LocationProducts';
import {LoyaltyCard} from '../../org-bigchaindb-backend/model/LoyaltyCard';
import {Organization} from '../../org-bigchaindb-backend/model/Organization';
import {Products} from '../../org-bigchaindb-backend/model/Products';
import {ConsumerService} from '../../org-bigchaindb-backend/service/ConsumerService';
import {ItemService} from '../../org-bigchaindb-backend/service/ItemService';
import {LocationProductsService} from '../../org-bigchaindb-backend/service/LocationProductsService';
import {LoyaltyCardService} from '../../org-bigchaindb-backend/service/LoyaltyCardService';
import {OrganizationService} from '../../org-bigchaindb-backend/service/OrganizationService';
import {ProductsService} from '../../org-bigchaindb-backend/service/ProductsService';
import {GetHisByTransIdInfo} from '../model/GetHisByTransIdInfo';
import {GetHisResponse} from '../model/GetHisResponse';
import {StatusCode} from '../model/StatusCode';
import {BigChainService} from '../service/BigChainService';

export class CombineServciesController {
  constructor(private bigChainService: BigChainService,
              private organizationService: OrganizationService,
              private productsService: ProductsService,
              private itemService: ItemService,
              private loyaltyService: LoyaltyCardService,
              private locationProductsService: LocationProductsService,
              private consumerService: ConsumerService
              ) {}

  private handleError(res: Response, error: Error) {
    if (error instanceof ClientError) {
      res.status(400).end('The Client Error: ' + error);
    } else {
      console.error(error.stack);
      res.status(500).end('Not found. ' + error.message);
    }
  }

  traceSource(req: Request, res: Response) {
    // Set data
    let currentTransId;
    currentTransId = req.query.currentTransId;
    if (!currentTransId) {
      throw new ClientError('No transaction Id.');
      // return res.status(400).end('No transaction Id.');
    }
    // Call service
    console.log('traceSource: ' + JSON.stringify(currentTransId));
    return this.bigChainService.traceProduct(currentTransId).pipe(flatMap((listHisByTransIdInfo) => {
        const traceProduct = this.transformTraceSource(listHisByTransIdInfo);
        return of(traceProduct);
    })).subscribe(
        resData => this.handleResponse(res, resData),
        err => this.handleError(res, err)
    );
  }

  private transformTraceSource(listHisByTransIdInfo: GetHisResponse[]) {
    let companyid = '';
    let name = '';
    let logo = '';
    let description = '';
    let location = [];
    let location_description = '';
    let attributes = [];
    const traceability_locations = [];
    Object.keys(listHisByTransIdInfo).forEach(key => {
      // for each provider
      attributes = [];
      name = key;
      let isSet = false;
      for (let i = 0; i < listHisByTransIdInfo[key].length; i++) {
        if (!isSet) {
          companyid = listHisByTransIdInfo[key][i].companyid;
          logo = listHisByTransIdInfo[key][i].logo;
          description = listHisByTransIdInfo[key][i].description;
          location = [+listHisByTransIdInfo[key][i].location[0], +listHisByTransIdInfo[key][i].location[1]];
          location_description = listHisByTransIdInfo[key][i].providerAddress;
          isSet = true;
        }
        let history: any;
        const ctn = [];
        if (listHisByTransIdInfo[key][i].noteAction !== 'Divide asset') {
          const newKeys = {productLine: 'Dòng mặt hàng', productDescription: 'Mô tả', quantity: 'Số lượng', unit: 'Đơn vị', productName: 'Tên sản phẩm'};
          // listHisByTransIdInfo[key][i].contents = JsonUtil.renameKeys(listHisByTransIdInfo[key][i].contents, newKeys);
          const newContent = JsonUtil.renameKeys(listHisByTransIdInfo[key][i].contents, newKeys);
          // Object.keys(listHisByTransIdInfo[key][i].contents).map((ikey) => {
          Object.keys(newContent).map((ikey) => {
            history = '';
            // history = ikey + ' : ' + listHisByTransIdInfo[key][i].contents[ikey];
            history = ikey + ' : ' + newContent[ikey];
            ctn.push(history);
            return history;
          });
        }
        if (listHisByTransIdInfo[key][i].noteAction === 'Divide asset') {
          listHisByTransIdInfo[key][i].noteAction = 'Phân chia tài sản';
          Object.keys(listHisByTransIdInfo[key][i].contents).map((ikey) => {
            history = {};
            history = listHisByTransIdInfo[key][i].contents[ikey];
            this.objToString(history);
            ctn.push(this.objToString(history));
            return history;
          });
        }
        const attribute = {
          time : listHisByTransIdInfo[key][i].timeStamp,
          activity : listHisByTransIdInfo[key][i].noteAction,
          sources: listHisByTransIdInfo[key][i].sources,
          content : ctn,
          transactionId : listHisByTransIdInfo[key][i].transactionId
        };
        attributes.push(attribute);
      } // End for each provider
      const traceability_location = {
        companyid: companyid,
        name: name,
        logo: logo,
        description: description,
        location: location,
        location_description: location_description,
        attributes: attributes
      };
      traceability_locations.push(traceability_location);
    });
    const traceSource = {
      // traceability_locations: traceability_locations,
      traceability_locations,
    };
    return traceSource;
  }

  traceProduct(req: Request, res: Response) {
    // Set data
    let currentTransId;
    currentTransId = req.query.currentTransId;
    if (!currentTransId) {
      throw new ClientError('No transaction Id.');
      // return res.status(400).end('No transaction Id.');
    }
    // Call service
    console.log('traceProduct: ' + JSON.stringify(currentTransId));
    // Get history
    return this.bigChainService.traceProduct(currentTransId).pipe(flatMap((listHisByTransIdInfo) => {
      // get itemId, productId and organizationId
      const itemId = this.find(listHisByTransIdInfo, 'itemId');
      if (!itemId) {
        throw new ClientError('No item Id.');
        // return of(res.status(400).end('No item Id.'));
      }
      const productCatId = this.find(listHisByTransIdInfo, 'productCatId');
      return this.productsService.getProductById(productCatId).pipe(flatMap(product => {
        const organizationId = product.organizationId;
        return this.organizationService.getOrgByOrgId(organizationId).pipe(flatMap( organization => {
          // Check login by facebook or google
          const consumerId = req.body.userId;
          if (req.body.userId) {
            // Begin Check consumer
            return this.consumerService.getConsumerById(consumerId).pipe(flatMap((consumers) => {
              if (!consumers) {
                  const consumer = new Consumer();
                  consumer.consumerId = StringUtil.uuid(uuidv4);
                  consumer.fullName = req.body.name || '';
                  consumer.telephone = '';
                  consumer.idCard = IDGenerator.randomNumber(12);
                  consumer.sex = 'M';
                  consumer.birthDay = '';
                  consumer.address = '';
                  consumer.email = req.body.email || '';
                  consumer.userId = req.body.userId || '';
                  consumer.sso = req.body.sso || '';
                  return this.consumerService.insert(consumer).pipe(flatMap((respConsumers) => {
                  // Begin origin before insert consumer
                    // Check loycard
                    return this.loyaltyService.existLoyaltyCard(req.body.userId, organization._id).pipe(flatMap(exist => {
                      const loyaltyCardFound = exist;
                      let loyaltyCardId = '';
                      if (!loyaltyCardFound) {
                        // Insert loyalty card
                        const loyaltyCard = new LoyaltyCard();
                        loyaltyCard.loyaltyCardId = StringUtil.uuid(uuidv4);
                        loyaltyCardId = loyaltyCard.loyaltyCardId;
                        loyaltyCard.cardNumber = IDGenerator.randomNumber(12);
                        loyaltyCard.ownerId = req.body.userId;
                        loyaltyCard.type = 0;
                        loyaltyCard.point = 0;
                        loyaltyCard.orgId = organization._id;
                        loyaltyCard.items = [];
                        return this.loyaltyService.insert(loyaltyCard).pipe(flatMap(resultLoyaltyCard => {
                          return this.itemService.getItemById(itemId).pipe(flatMap(item => {
                            const traceProduct = this.transformTraceProduct(currentTransId, listHisByTransIdInfo, organization, product, item);
                              // Begin Insert location
                              if (req.body.location) {
                                const locationProduct = new LocationProducts();
                                locationProduct.locationProductId = StringUtil.uuid(uuidv4);
                                locationProduct.productId = productCatId;
                                locationProduct.scanLocation = req.body.location;
                                locationProduct.scanDate = new Date();
                                locationProduct.itemId = itemId;
                                locationProduct.transactionId = currentTransId;
                                return this.locationProductsService.insert(locationProduct).pipe(flatMap(respLocation => {
                                  // Update point
                                  const objLoyaltyCard = {
                                    loyaltyCardId: loyaltyCardId,
                                    items: [
                                      {
                                        itemId: itemId,
                                        point: item.point,
                                        scanDate: new Date().toISOString(),
                                        location: [
                                          req.body.location[0].toString(),
                                          req.body.location[1].toString()
                                        ]
                                      }
                                    ]
                                  };
                                  return this.loyaltyService.updateLoyaltyCard(objLoyaltyCard, loyaltyCardId).pipe(flatMap(respupdateLoyaltyaCard => {
                                      const obj = new Item();
                                      obj.actionCode = 3; // Added point
                                      return this.itemService.updateActionCodeItem(obj, itemId).pipe(flatMap(resp => {
                                            return of(traceProduct);
                                      })); // updateActionCodeItem 1
                                  }));
                                  // End upcate point
                                }));
                              } else {
                                return of(traceProduct);
                              }
                              // End insert location
                          }));
                        }));
                      } else { // End of isExist
                        loyaltyCardId = loyaltyCardFound._id;
                        return this.itemService.getItemById(itemId).pipe(flatMap(item => {
                          const traceProduct = this.transformTraceProduct(currentTransId, listHisByTransIdInfo, organization, product, item);
                            // Begin Insert location
                            if (req.body.location) {
                              const locationProduct = new LocationProducts();
                              locationProduct.locationProductId = StringUtil.uuid(uuidv4);
                              locationProduct.productId = productCatId;
                              locationProduct.scanLocation = req.body.location;
                              locationProduct.scanDate = new Date();
                              locationProduct.itemId = itemId;
                              locationProduct.transactionId = currentTransId;
                              return this.locationProductsService.insert(locationProduct).pipe(flatMap(respLocation => {
                                // Update point
                                const objLoyaltyCard = {
                                  loyaltyCardId: loyaltyCardId,
                                  items: [
                                    {
                                      itemId: itemId,
                                      point: item.point,
                                      scanDate: new Date().toISOString(),
                                      location: [
                                        req.body.location[0].toString(),
                                        req.body.location[1].toString()
                                      ]
                                    }
                                  ]
                                };
                                return this.loyaltyService.updateLoyaltyCard(objLoyaltyCard, loyaltyCardId).pipe(flatMap(respupdateLoyaltyaCard => {
                                    const obj = new Item();
                                    obj.actionCode = 3; // Added point
                                    return this.itemService.updateActionCodeItem(obj, itemId).pipe(flatMap(resp => {
                                        return of(traceProduct);
                                    })); // updateActionCodeItem 2
                                }));
                                // End upcate point
                              }));
                            } else { // End of req.body.location
                              return of(traceProduct);
                            }
                            // End insert location
                        }));
                      }
                    }));
                  // End origin before insert consumer
                  }));
              } else {
                // Check loycard
                return this.loyaltyService.existLoyaltyCard(req.body.userId, organization._id).pipe(flatMap(exist => {
                  const loyaltyCardFound = exist;
                  let loyaltyCardId = '';
                  if (!loyaltyCardFound) {
                    // Insert loyalty card
                    const loyaltyCard = new LoyaltyCard();
                    loyaltyCard.loyaltyCardId = StringUtil.uuid(uuidv4);
                    loyaltyCardId = loyaltyCard.loyaltyCardId;
                    loyaltyCard.cardNumber = IDGenerator.randomNumber(12);
                    loyaltyCard.ownerId = req.body.userId;
                    loyaltyCard.type = 0;
                    loyaltyCard.point = 0;
                    loyaltyCard.orgId = organization._id;
                    loyaltyCard.items = [];
                    return this.loyaltyService.insert(loyaltyCard).pipe(flatMap(resultLoyaltyCard => {
                      return this.itemService.getItemById(itemId).pipe(flatMap(item => {
                        const traceProduct = this.transformTraceProduct(currentTransId, listHisByTransIdInfo, organization, product, item);
                          // Begin Insert location
                          if (req.body.location) {
                            const locationProduct = new LocationProducts();
                            locationProduct.locationProductId = StringUtil.uuid(uuidv4);
                            locationProduct.productId = productCatId;
                            locationProduct.scanLocation = req.body.location;
                            locationProduct.scanDate = new Date();
                            locationProduct.itemId = itemId;
                            locationProduct.transactionId = currentTransId;
                            return this.locationProductsService.insert(locationProduct).pipe(flatMap(respLocation => {
                              // Update point
                              const objLoyaltyCard = {
                                loyaltyCardId: loyaltyCardId,
                                items: [
                                  {
                                    itemId: itemId,
                                    point: item.point,
                                    scanDate: new Date().toISOString(),
                                    location: [
                                      req.body.location[0].toString(),
                                      req.body.location[1].toString()
                                    ]
                                  }
                                ]
                              };
                              return this.loyaltyService.updateLoyaltyCard(objLoyaltyCard, loyaltyCardId).pipe(flatMap(respupdateLoyaltyaCard => {
                                  const obj = new Item();
                                  obj.actionCode = 3; // Added point
                                  return this.itemService.updateActionCodeItem(obj, itemId).pipe(flatMap(resp => {
                                        return of(traceProduct);
                                  })); // updateActionCodeItem 3
                              }));
                              // End upcate point
                            }));
                          } else {
                            return of(traceProduct);
                          }
                          // End insert location
                      }));
                    }));
                  } else { // End of isExist
                    loyaltyCardId = loyaltyCardFound._id;
                    return this.itemService.getItemById(itemId).pipe(flatMap(item => {
                      const traceProduct = this.transformTraceProduct(currentTransId, listHisByTransIdInfo, organization, product, item);
                        // Begin Insert location
                        if (req.body.location) {
                          const locationProduct = new LocationProducts();
                          locationProduct.locationProductId = StringUtil.uuid(uuidv4);
                          locationProduct.productId = productCatId;
                          locationProduct.scanLocation = req.body.location;
                          locationProduct.scanDate = new Date();
                          locationProduct.itemId = itemId;
                          locationProduct.transactionId = currentTransId;
                          return this.locationProductsService.insert(locationProduct).pipe(flatMap(respLocation => {
                            // Update point
                            const objLoyaltyCard = {
                              loyaltyCardId: loyaltyCardId,
                              items: [
                                {
                                  itemId: itemId,
                                  point: item.point,
                                  scanDate: new Date().toISOString(),
                                  location: [
                                    req.body.location[0].toString(),
                                    req.body.location[1].toString()
                                  ]
                                }
                              ]
                            };
                            return this.loyaltyService.updateLoyaltyCard(objLoyaltyCard, loyaltyCardId).pipe(flatMap(respupdateLoyaltyaCard => {
                                const obj = new Item();
                                obj.actionCode = 3; // Added point
                                return this.itemService.updateActionCodeItem(obj, itemId).pipe(flatMap(resp => {
                                    return of(traceProduct);
                                })); // updateActionCodeItem 4
                            }));
                            // End upcate point
                          }));
                        } else { // End of req.body.location
                          return of(traceProduct);
                        }
                        // End insert location
                    }));
                  }
                }));
              }
            }));
            // End Check consumer
          } else { // End of req.body.userId
            return this.itemService.getItemById(itemId).pipe(flatMap(item => {
              const traceProduct = this.transformTraceProduct(currentTransId, listHisByTransIdInfo, organization, product, item);
              const obj = new Item();
              obj.actionCode = 2; // Scanned
              return this.itemService.updateActionCodeItem(obj, itemId).pipe(flatMap(resp => {
                if (req.body.location) {
                  const locationProduct = new LocationProducts();
                  locationProduct.locationProductId = StringUtil.uuid(uuidv4);
                  locationProduct.productId = productCatId;
                  locationProduct.scanLocation = req.body.location;
                  locationProduct.scanDate = new Date();
                  locationProduct.itemId = itemId;
                  locationProduct.transactionId = currentTransId;
                  return this.locationProductsService.insert(locationProduct).pipe(flatMap(respLocation => {
                    return of(traceProduct);
                    // End inserlocation
                  }));
                } else {
                  return of(traceProduct);
                }
              }));
            }));
          }
        }));
      }));
    })).subscribe( // End get history
        resData => this.handleResponse(res, resData),
        err => this.handleError(res, err)
    );
  }

  private transformTraceProduct(getHisByTransIdInfo: string, listHisByTransIdInfo: GetHisResponse[], organization: Organization, product: Products, item: Item) {
    let companyid = '';
    let name = '';
    let logo = '';
    let description = '';
    let location = [];
    let location_description = '';
    let attributes = [];
    const traceability_locations = [];
    Object.keys(listHisByTransIdInfo).forEach(key => {
      // for each provider
      attributes = [];
      name = key;
      let isSet = false;
      for (let i = 0; i < listHisByTransIdInfo[key].length; i++) {
        if (!isSet) {
          companyid = listHisByTransIdInfo[key][i].companyid;
          logo = listHisByTransIdInfo[key][i].logo;
          description = listHisByTransIdInfo[key][i].description;
          location = [parseFloat(listHisByTransIdInfo[key][i].location[0]), parseFloat(listHisByTransIdInfo[key][i].location[1])];
          location_description = listHisByTransIdInfo[key][i].providerAddress;
          isSet = true;
        }
        let history: any;
        const ctn = [];
        if (listHisByTransIdInfo[key][i].noteAction !== 'Divide asset') {
          const newKeys = {productLine: 'Dòng mặt hàng', productDescription: 'Mô tả', quantity: 'Số lượng', unit: 'Đơn vị', productName: 'Tên sản phẩm'};
          // listHisByTransIdInfo[key][i].contents = JsonUtil.renameKeys(listHisByTransIdInfo[key][i].contents, newKeys);
          const newContent = JsonUtil.renameKeys(listHisByTransIdInfo[key][i].contents, newKeys);
          // Object.keys(listHisByTransIdInfo[key][i].contents).map((ikey) => {
          Object.keys(newContent).map((ikey) => {
            history = '';
            // history = ikey + ' : ' + listHisByTransIdInfo[key][i].contents[ikey];
            history = ikey + ' : ' + newContent[ikey];
            ctn.push(history);
            return history;
          });
        }
        if (listHisByTransIdInfo[key][i].noteAction === 'Divide asset') {
          listHisByTransIdInfo[key][i].noteAction = 'Phân chia tài sản';
          Object.keys(listHisByTransIdInfo[key][i].contents).map((ikey) => {
            history = {};
            history = listHisByTransIdInfo[key][i].contents[ikey];
            this.objToString(history);
            ctn.push(this.objToString(history));
            return history;
          });
        }
        const attribute = {
          time : listHisByTransIdInfo[key][i].timeStamp.split('T')[0],
          activity : listHisByTransIdInfo[key][i].noteAction,
          sources: listHisByTransIdInfo[key][i].sources,
          content : ctn,
          transactionId : listHisByTransIdInfo[key][i].transactionId
        };
        attributes.push(attribute);
      } // End for each provider
      const traceability_location = {
        companyid: companyid,
        name: name,
        logo: logo,
        description: description,
        location: location,
        location_description: location_description,
        attributes: attributes
      };
      traceability_locations.push(traceability_location);
    });
/*
    const newKeys = {productLine: 'Dòng mặt hàng', productDescription: 'Mô tả', quantity: 'Số lượng', unit: 'Đơn vị', productName: 'Tên sản phẩm'};
    traceability_locations.forEach(elem => {
      elem['attributes'].forEach(elemchild => {
        elemchild['content'] = JsonUtil.renameKeys(elemchild['content'], newKeys);
      });
    });
*/
    const traceProduct = {
      code: getHisByTransIdInfo,
      name: product.name,
      status: product.status,
      actioncode: item.actionCode,
      point: item.point,
      image_ads: product.imageAds,
      image_unit: product.imageUnit,
      introduction: product.introduction,
      exp: item.exp,
      mfg: item.mfg,
      lot: item.lot,
      company: {
        id: organization._id,
        name: organization.organizationName,
        logo: organization.imageUrl,
        address: organization.organizationAddress,
        tel: organization.organizationPhone,
        email: organization.email
      },
      traceability_locations: traceability_locations,
      ingredient_descriptions: product.ingredientDescriptions,
      promotion_descriptions: organization.promotionDescriptions,
      ads_descriptions: organization.adsDescriptions
    };
    return traceProduct;
  }

  private find (data, keyName) {
    // tslint:disable-next-line:forin
    for (const key in data) {
      const entry = data[key];
      if (key === keyName) {
        return entry;
      }
      if (typeof entry === 'object') {
        const found = this.find(entry, keyName);
        if (found) {
          return found;
        }
      }
    }
  }
  /**
   * setDataForGetHisAssetByTransId
   * set data for GetHisAssetByTransId.
   * @param {*} request - The request from client.
   * @returns {*} set data result.
   */
  private setDataForGetHisAssetByTransId(request) {
    if (!request.currentTransId) {
      throw new Error('Set Data is failed: No currentTransId');
    }
    const getHisByTransIdInfo = new GetHisByTransIdInfo();
    getHisByTransIdInfo.currentTransId = request.currentTransId;
    getHisByTransIdInfo.operation = request.operation || undefined;
    if (getHisByTransIdInfo) {
      return getHisByTransIdInfo;
    } else {
      throw new Error('Set Data is failed' + JSON.stringify(getHisByTransIdInfo));
    }
  }

  getSearchItemIdByTxId(req: Request, res: Response) {
    // Set data
    let currentTransId;
    currentTransId = req.query.currentTransId;
    if (!currentTransId) {
      throw new ClientError('No transaction Id.');
      // return res.status(400).end('No transaction Id.');
    }
    // Call service
    console.log('getSearchItemIdByTxId: ' + JSON.stringify(currentTransId));
    // Get history
    return this.bigChainService.traceProduct(currentTransId).pipe(flatMap((listHisByTransIdInfo) => {
      // get itemId, productId and organizationId
      const itemId = this.find(listHisByTransIdInfo, 'itemId');
      if (!itemId) {
        throw new ClientError('No item Id.');
        // return of(res.status(400).end('No item Id.'));
      }
      return of({itemId: itemId});
    })).subscribe( // End get history
        resData => this.handleResponse(res, resData),
        err => this.handleError(res, err)
    );
  }

  private objToString (obj) {
    let str = '';
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        str += p + ':' + obj[p] + '\n';
      }
    }
    return str;
  }

  private handleResponse(res: Response, resData) {
    switch (resData) {
      case StatusCode.Success: {
        res.status(200).end('Success');
        break;
      }
      case StatusCode.Forbidden: {
        res.status(403).end('Forbidden');
        break;
      }
      case StatusCode.InvalidDestination: {
        res.status(404).end('InvalidDestination');
        break;
      }
      case StatusCode.Error: {
        res.status(400).end('Error');
        break;
      }
      default: {
        res.status(200).json(resData).end();
        break;
      }
    }
  }

}

class ClientError extends Error {
  constructor(message: string) {
    super(message);
  }
}
