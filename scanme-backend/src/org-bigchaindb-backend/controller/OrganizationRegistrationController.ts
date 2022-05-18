import {Request, Response} from 'express';
import {ResponseUtil} from '../../web-core';
import {OrganizationRegistrationService} from '../service/OrganizationRegistrationService';

export class OrganizationRegistrationController {
  constructor(private organizationRegistrationService: OrganizationRegistrationService) {
  }

  registerOrganization(req: Request, res: Response) {
    this.organizationRegistrationService.registerOrganization(req.body).subscribe(
        result => ResponseUtil.succeed(res, result),
        err => ResponseUtil.error(res, err)
    );
  }
}
