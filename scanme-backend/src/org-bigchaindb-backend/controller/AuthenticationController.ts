import { Request, Response } from 'express';
import {AuthenticationService} from '../service/AuthenticationService';

export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {
  }
  
  authenticate(req: Request, res: Response) {
    console.log('go to authentication');
      const user = req.body;
      return this.authenticationService.authenticate(user).subscribe(
        
        result => res.status(200).json(result),
        err => res.status(500).send(err)
      );
    
  }
}
