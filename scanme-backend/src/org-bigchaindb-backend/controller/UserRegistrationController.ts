import {Request, Response} from 'express';
import {JsonUtil} from '../../core';
import {ResponseUtil} from '../../web-core';
import {UserRegistrationService} from '../service/UserRegistrationService';
// import * as driver from 'bigchaindb-driver';
// import config from '../../config';

export class UserRegistrationController {
  constructor(private userRegistrationService: UserRegistrationService) {
  }

  // hackUserPass(req: Request, res: Response) {
  //   const userId = req.params['userId'];
  //   const password = req.params['password'];

  //   this.userRegistrationService.hackUserPass(userId, password).subscribe(
  //     success => res.status(200).json(success),
  //     err => ResponseUtil.error(res, err)
  //   );
  // }

  registerUser(req: Request, res: Response) {
    this.userRegistrationService.registerUser(req.body).subscribe(
      result => ResponseUtil.succeed(res, result),
      err => ResponseUtil.error(res, err)
    );
  }

  // hackRegisterUser(req: Request, res: Response) {
  //   var body = {
  //     userName: "admin057",
  //     password: "3DUq05MK",
  //     email: "admin057@mailinator.com",
  //     firstName: "string",
  //     lastName: "string",
  //     displayName: "string",
  //     adminId: "4821bca811e64523bdfc40ad6be2c18f"
  //   };

  //   this.userRegistrationService.registerUser(body).subscribe(
  //     result => ResponseUtil.succeed(res, result),
  //     err => ResponseUtil.error(res, err)
  //   );
  // }

  // generateTestTransaction(req: Request, res: Response) {
  //   // Create a new keypair for Alice and Bob
  //   const alice = new driver.Ed25519Keypair();
  //   const bob = new driver.Ed25519Keypair();

  //   // Define the asset to store, in this example
  //   // we store a bicycle with its serial number and manufacturer
  //   const assetdata = {
  //     'bicycle': {
  //       'serial_number': 'cde',
  //       'manufacturer': 'Bicycle Inc.',
  //     }
  //   }

  //   // Metadata contains information about the transaction itself
  //   // (can be `null` if not needed)
  //   // E.g. the bicycle is fabricated on earth
  //   const metadata = {'planet': 'earth'}

  //   // Construct a transaction payload
  //   const txCreateAliceSimple = driver.Transaction.makeCreateTransaction(
  //     assetdata,
  //     metadata,

  //     // A transaction needs an output
  //     [ driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(alice.publicKey))],
  //     alice.publicKey
  //   )

  //   // Sign the transaction with private keys of Alice to fulfill it
  //   const txCreateAliceSimpleSigned = driver.Transaction.signTransaction(txCreateAliceSimple, alice.privateKey)

  //   // Send the transaction off to BigchainDB
  //   const conn = new driver.Connection(config.BIGCHAIN.API_PATH)

  //   conn.postTransactionCommit(txCreateAliceSimpleSigned)
  //       .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
  //       .catch(error => {console.log(error)});
  // }

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
