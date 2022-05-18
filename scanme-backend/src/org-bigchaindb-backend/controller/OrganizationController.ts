import {Request, Response} from 'express';
import {ResponseUtil} from '../../common/controller/util/ResponseUtil';
import {MetadataUtil} from '../../common/metadata/util/MetadataUtil';
import {JsonUtil} from '../../common/util/JsonUtil';
import {GetOrgModel} from '../model/GetOrgModel';
import {OrganizationService} from '../service/OrganizationService';

export class OrganizationController {
  constructor(private organizationService: OrganizationService) {
  }

  private handleError(res: Response, error: Error) {
    if (error instanceof ClientError) {
      res.status(400).end('The Client Error: ' + error);
    } else {
      console.error(error.stack);
      res.status(500).end('The Internal Server Error: ' + error.message);
    }
  }

  /*
      getOrganizationByName(req: Request, res: Response) {
          // Get authentication token
          const authenticationToken: AuthorizationToken = res.locals.authorizationToken;
          // Get privateKey
          return this.identityService.getIdentityByUserId(authenticationToken.userId).pipe(flatMap((identity) => {
              // Set data
              let getOrgModel: GetOrgModel;
              try {
                  getOrgModel = this.setDataGetOrgModel(req.query);
              } catch (err) {
                  throw new ClientError(err);
              }
              // Call service
              console.log('burnAssetToken: ' + JSON.stringify(getOrgModel));
              return this.organizationService.getOrganizationByName(getOrgModel.name, getOrgModel.limit);
          })).subscribe(
              resData => res.status(200).json(resData),
              err => this.handleError(res, err)
          );
      }
  */

  getOrganizationByName(req: Request, res: Response) {
    // Set data
    let getOrgModel: GetOrgModel;
    try {
      getOrgModel = this.setDataGetOrgModel(req.query);
    } catch (err) {
      throw new ClientError(err);
    }
    // Call service
    console.log('getOrganizationByName: ' + JSON.stringify(getOrgModel));
    return this.organizationService.getOrganizationByName(getOrgModel).subscribe(
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

  /*
      getPublicKeyByOrgId(req: Request, res: Response) {
          // Get authentication token
          const authenticationToken: AuthorizationToken = res.locals.authorizationToken;
          // Get privateKey
          return this.identityService.getIdentityByUserId(authenticationToken.userId).pipe(flatMap((identity) => {
              // Set data
              const organId = req.query.id;
              if (!organId) {
                  throw new ClientError('No organization Id');
              }
              // Call service
              return this.organizationService.getPublicKeyByOrgId(organId);
          })).subscribe(
              resData => res.status(200).json(resData),
              err => this.handleError(res, err)
          );
      }
  */

  getPublicKeyByOrgId(req: Request, res: Response) {
    // Set data
    const organId = req.query.id;
    if (!organId) {
      throw new ClientError('No organization Id');
    }
    // Call service
    return this.organizationService.getPublicKeyByOrgId(organId).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }

  getOrgByOrgId(req: Request, res: Response) {
    // Set data
    const organId = req.query.id;
    if (!organId) {
      throw new ClientError('No organization Id');
    }
    // Call service
    return this.organizationService.getOrgByOrgId(organId).subscribe(
        resData => res.status(200).json(resData),
        err => this.handleError(res, err)
    );
  }

  update(req: Request, res: Response) {
    const obj = req.body;
    if (!obj || obj === '') {
      res.status(400).end('The request body cannot be empty.');
    } else {
      const metadata = MetadataUtil.getMetaModel(this.organizationService.getMetaData());
      if (metadata.primaryKeys.length === 1) {
        const id = req.params.id;
        if (!id || id === '') {
          return res.status(400).end('Id cannot be empty.');
        }
      }
      this.organizationService.update(obj).subscribe(
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
