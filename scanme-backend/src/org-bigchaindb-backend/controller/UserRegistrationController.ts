import {Request, Response} from 'express';
import {JsonUtil} from '../../core';
import {ResponseUtil} from '../../web-core';
import {UserRegistrationService} from '../service/UserRegistrationService';

export class UserRegistrationController {
  constructor(private userRegistrationService: UserRegistrationService) {
  }

  registerUser(req: Request, res: Response) {
    this.userRegistrationService.registerUser(req.body).subscribe(
      result => ResponseUtil.succeed(res, result),
      err => ResponseUtil.error(res, err)
    );
  }

  confirmUser(req: Request, res: Response) {
    const userId = req.params['userId'];
    const passcode = req.params['passcode'];

    this.userRegistrationService.confirmUser(userId, passcode).subscribe(
      success => res.status(200).json(success),
      err => ResponseUtil.error(res, err)
    );
  }

  confirmOrg(req: Request, res: Response) {
    const userId = req.params['userId'];
    const passcode = req.params['passcode'];

    this.userRegistrationService.confirmOrg(userId, passcode).subscribe(
        success => res.status(200).json(success),
        err => ResponseUtil.error(res, err)
    );
  }

}
