import {Application} from 'express';
import {Db} from 'mongodb';
import {ApplicationContext} from './context/ApplicationContext';
import {AuthenticationController} from './controller/AuthenticationController';
import {ConsumerController} from './controller/ConsumerController';
import {GiftController} from './controller/GiftController';
import {ItemController} from './controller/ItemController';
import {LocationProductsController} from './controller/LocationProductsController';
import {LoyaltyCardController} from './controller/LoyaltyCardController';
import {OrganizationController} from './controller/OrganizationController';
import {OrganizationRegistrationController} from './controller/OrganizationRegistrationController';
import {ProductsController} from './controller/ProductsController';
import {UserRegistrationController} from './controller/UserRegistrationController';
import * as multer from 'multer';

export class OrgBigChainDBBackEndRoutes {
  private readonly applicationContext: ApplicationContext;
  private readonly userRegistrationController: UserRegistrationController;
  private readonly organizationRegistrationController: OrganizationRegistrationController;
  private readonly organizationController: OrganizationController;
  private readonly productsController: ProductsController;
  private readonly itemController: ItemController;
  private readonly consumerController: ConsumerController;
  private readonly giftController: GiftController;
  private readonly loyaltyCardController: LoyaltyCardController;
  private readonly locationProductsController: LocationProductsController;
  private readonly authenticationController: AuthenticationController;
  private readonly upload: any;

  constructor(
    mongoDb: Db,
    sendGridApiKey: string,
    fromEmail: string,
    domain: string,
    httpPort: number,
    httpsSecure: boolean,
    passcodeConfirmUserExpires: number,
    maxPasswordAge: number,
    encryptPasswordKey: string,
    blacklistTokenKeyPrefix: string,
    tokenSecret: string,
    tokenExpires: number
  ) {
    this.applicationContext = new ApplicationContext(
      mongoDb,
      sendGridApiKey,
      fromEmail,
      domain,
      httpPort,
      httpsSecure,
      passcodeConfirmUserExpires,
      maxPasswordAge,
      encryptPasswordKey,
      blacklistTokenKeyPrefix,
      tokenSecret,
      tokenExpires
    );
    this.userRegistrationController = this.applicationContext.getUserRegistrationController();
    this.authenticationController = this.applicationContext.getAuthenticationController();
    this.organizationRegistrationController = this.applicationContext.getOrganizationRegistrationController();
    this.organizationController = this.applicationContext.getOrganizationController();
    this.productsController = this.applicationContext.getProductsController();
    this.itemController = this.applicationContext.getItemController();
    this.consumerController = this.applicationContext.getConsumerController();
    this.giftController = this.applicationContext.getGiftController();
    this.loyaltyCardController = this.applicationContext.getLoyaltyCardController();
    this.locationProductsController = this.applicationContext.getLocationProductsController();
    this.upload = multer();
  }

  routes(app: Application): void {
    app.route('/org-registration/register')
        .post(this.organizationRegistrationController.registerOrganization.bind(this.organizationRegistrationController));

    app.route('/org-registration/confirm/:userId/:passcode')
        .get(this.userRegistrationController.confirmOrg.bind(this.userRegistrationController));

    app.route('/user-registration/register')
        .post(this.userRegistrationController.registerUser.bind(this.userRegistrationController));

    app.route('/user-registration/confirm/:userId/:passcode')
      .get(this.userRegistrationController.confirmUser.bind(this.userRegistrationController));

    app.route('/authenticate')
        .put(this.authenticationController.authenticate.bind(this.authenticationController));

    // app.route('/hack-user-pass/:userId/:password')
    //     .get(this.userRegistrationController.hackUserPass.bind(this.userRegistrationController));

    // app.route('/hack-register')
    //     .get(this.userRegistrationController.hackRegisterUser.bind(this.userRegistrationController));

    // app.route('/generate-test')
    //     .get(this.userRegistrationController.generateTestTransaction.bind(this.userRegistrationController));
    
    // /*
    //     app.route('/getOrganizationByName') // Get
    //                 .get(this.authHandler.checkToken.bind(this.authHandler), this.bigChainController.getOrganizationByName.bind(this.bigChainController));
    //
    //     app.route('/getPublicKeyByOrgId') // Get
    //                 .get(this.authHandler.checkToken.bind(this.authHandler), this.bigChainController.getPublicKeyByOrgId.bind(this.bigChainController));
    // */

    app.route('/getOrganizationByName') // Get
        .get(this.organizationController.getOrganizationByName.bind(this.organizationController));

    app.route('/getOrganizationByOrgId') // Get
        .get(this.organizationController.getOrgByOrgId.bind(this.organizationController));

    app.route('/getPublicKeyByOrgId') // Get
        .get(this.organizationController.getPublicKeyByOrgId.bind(this.organizationController));

    app.route('/organization/:id') // update organization
        .put(this.organizationController.update.bind(this.organizationController));

    // Products
    app.route('/getProducts') // Get
        .get(this.productsController.getProducts.bind(this.productsController));

    app.route('/getProductById') // Get
        .get(this.productsController.getProductById.bind(this.productsController));

    app.route('/getProductByOrgId') // Get
        .get(this.productsController.getProductByOrgId.bind(this.productsController));

    app.route('/product') // insert product
        .post(this.productsController.insert.bind(this.productsController));

    app.route('/product/:id') // update product
        .put(this.productsController.update.bind(this.productsController));

    app.route('/product/:id') // delete product
        .delete(this.productsController.delete.bind(this.productsController));

    app.route('/uploadImage') // upload image
        .post(this.upload.single('file'), this.productsController.uploadImage.bind(this.productsController));

    // Item
    app.route('/getItem') // Get
        .get(this.itemController.getItem.bind(this.itemController));

    app.route('/getItemById') // Get
        .get(this.itemController.getItemById.bind(this.itemController));

    app.route('/getItemByProductCatId') // Get
        .get(this.itemController.getItemByProductCatId.bind(this.itemController));

    app.route('/item') // insert product
        .post(this.itemController.insert.bind(this.itemController));

    app.route('/items') // insert product
        .post(this.itemController.insertObjects.bind(this.itemController));

    app.route('/item/:id') // update item
        .put(this.itemController.update.bind(this.itemController));

    app.route('/items') // update list items
        .put(this.itemController.updateObjects.bind(this.itemController));

    app.route('/item/:id') // delete item
        .delete(this.itemController.delete.bind(this.itemController));

    app.route('/items') // delete list items
        .delete(this.itemController.deleteByIds.bind(this.itemController));

    // loyaltyCard
    app.route('/getLoyaltyCardByOwnerId') // Get
        .get(this.loyaltyCardController.getLoyaltyCardByOwnerId.bind(this.loyaltyCardController));

    app.route('/getConsumerByOrgId') // Get
        .get(this.loyaltyCardController.getConsumerByOrgId.bind(this.loyaltyCardController));

    app.route('/getLoyaltyCardByOwnerIdMobile') // Get
        .get(this.loyaltyCardController.getLoyaltyCardByOwnerIdMobile.bind(this.loyaltyCardController));

    app.route('/updateLoyaltyCardById') // Update
        .put(this.loyaltyCardController.updateLoyaltyCardById.bind(this.loyaltyCardController));

    app.route('/existLoyaltyCard') // Get
        .get(this.loyaltyCardController.existLoyaltyCard.bind(this.loyaltyCardController));

    // Gift
    app.route('/getGift') // Get
        .get(this.giftController.getGift.bind(this.giftController));

    app.route('/getGiftByOrgId') // Get
        .get(this.giftController.getGiftByOrgId.bind(this.giftController));

    app.route('/gift') // insert
        .post(this.giftController.insert.bind(this.giftController));

    app.route('/gift/:id') // update
        .put(this.giftController.update.bind(this.giftController));

    app.route('/gift/:id') // delete item
        .delete(this.giftController.delete.bind(this.giftController));

    // LocationProducts
    app.route('/getLocationProductsByOrgId') // Get
        .get(this.locationProductsController.getLocationProductsByOrgId.bind(this.locationProductsController));

    app.route('/countLocationProductsByTxId') // Get
        .get(this.locationProductsController.countLocationProductsByTxId.bind(this.locationProductsController));

    app.route('/locationProduct') // insert locationProduct
        .post(this.locationProductsController.insert.bind(this.locationProductsController));

    // Consumer
    app.route('/getConsumer') // Get
        .get(this.consumerController.getConsumer.bind(this.consumerController));

    app.route('/getConsumerByUserId') // Get
        .get(this.consumerController.getConsumerById.bind(this.consumerController));

    app.route('/consumer') // insert Consumer
        .post(this.consumerController.insert.bind(this.consumerController));

    app.route('/consumer/:id') // insert Consumer
        .put(this.consumerController.update.bind(this.consumerController));

  }
}
