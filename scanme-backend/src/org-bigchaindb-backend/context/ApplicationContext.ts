import * as SendGrid from '@sendgrid/mail';
import {SendGridMailService} from '../../core';
import {
  AuthorizationRepositoryImpl,
  InviteAuthorizationRepositoryImpl
} from '../../shared/authorization-repository-mongo';
import {InviteServiceImpl} from '../../shared/invite-service';
import {ConfirmMailServiceImpl} from '../../shared/user-confirm-mail-service';
import {AuthenticationRepositoryImpl, UserRepositoryImpl} from '../../shared/user-repository-mongo';
import {AuthenticationController} from '../controller/AuthenticationController';
import {ConsumerController} from '../controller/ConsumerController';
import {GiftController} from '../controller/GiftController';
import {ItemController} from '../controller/ItemController';
import {LocationProductsController} from '../controller/LocationProductsController';
import {LoyaltyCardController} from '../controller/LoyaltyCardController';
import {OrganizationController} from '../controller/OrganizationController';
import {OrganizationRegistrationController} from '../controller/OrganizationRegistrationController';
import {ProductsController} from '../controller/ProductsController';
import {UserRegistrationController} from '../controller/UserRegistrationController';
import {ConsumerRepositoryImpl} from '../repository/impl/ConsumerRepositoryImpl';
import {GiftRepositoryImpl} from '../repository/impl/GiftRepositoryImpl';
import {IdentityRepositoryImpl} from '../repository/impl/IdentityRepositoryImpl';
import {ItemRepositoryImpl} from '../repository/impl/ItemRepositoryImpl';
import {LocationProductsRepositoryImpl} from '../repository/impl/LocationProductsRepositoryImpl';
import {LoyaltyCardRepositoryImpl} from '../repository/impl/LoyaltyCardRepositoryImpl';
import {OrganizationRepositoryImpl} from '../repository/impl/OrganizationRepositoryImpl';
import {ProductsRepositoryImpl} from '../repository/impl/ProductsRepositoryImpl';
import {UserRegistrationCodeRepositoryImpl} from '../repository/impl/UserRegistrationCodeRepositoryImpl';
import {AuthenticationServiceImpl} from '../service/impl/AuthenticationServiceImpl';
import {ConsumerServiceImpl} from '../service/impl/ConsumerServiceImpl';
import {GiftServiceImpl} from '../service/impl/GiftServiceImpl';
import {ItemServiceImpl} from '../service/impl/ItemServiceImpl';
import {LocationProductsServiceImpl} from '../service/impl/LocationProductsServiceImpl';
import {LoyaltyCardServiceImpl} from '../service/impl/LoyaltyCardServiceImpl';
import {OrganizationRegistrationServiceImpl} from '../service/impl/OrganizationRegistrationServiceImpl';
import {OrganizationServiceImpl} from '../service/impl/OrganizationServiceImpl';
import {ProductsServiceImpl} from '../service/impl/ProductsServiceImpl';
import {UserInfoServiceImpl} from '../service/impl/UserInfoServiceImpl';
import {UserRegistrationServiceImpl} from '../service/impl/UserRegistrationServiceImpl';

export class ApplicationContext {
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

  constructor(
    mongodb,
    sendGridApiKey: string,
    fromEmail: string,
    domain: string,
    httpPort: number,
    httpsSecure: boolean,
    passcodeConfirmUserExpires: number,
    maxPasswordAge: number,
    encryptPasswordKey: string,
    blacklistTokenKeyPrefix,
    tokenSecret: string,
    tokenExpires: number
  ) {
    const mailService = new SendGridMailService(SendGrid, sendGridApiKey);
    const userRepository = new UserRepositoryImpl(mongodb);
    const orgRepository = new OrganizationRepositoryImpl(mongodb);
    const productsRepository = new ProductsRepositoryImpl(mongodb);
    const itemRepository = new ItemRepositoryImpl(mongodb);
    const consumerRepository = new ConsumerRepositoryImpl(mongodb);
    const giftRepository = new GiftRepositoryImpl(mongodb);
    const loyaltyCardRepository = new LoyaltyCardRepositoryImpl(mongodb);
    const locationProductsRepository = new LocationProductsRepositoryImpl(mongodb);
    const authenticationRepository = new AuthenticationRepositoryImpl(mongodb);
    const userRegistrationCodeRepository = new UserRegistrationCodeRepositoryImpl(mongodb);
    const identityRepository = new IdentityRepositoryImpl(mongodb);
    const authorizationRepository = new AuthorizationRepositoryImpl(mongodb);
    const inviteAuthorizationRepository = new InviteAuthorizationRepositoryImpl(mongodb);

    const inviteService = new InviteServiceImpl(authorizationRepository, inviteAuthorizationRepository);
    const confirmMailService = new ConfirmMailServiceImpl(userRegistrationCodeRepository, mailService, fromEmail, domain, httpPort, httpsSecure, passcodeConfirmUserExpires);

    const userRegistrationService = new UserRegistrationServiceImpl(
      inviteService,
      confirmMailService,
      userRepository,
      authenticationRepository,
      userRegistrationCodeRepository,
      identityRepository,
      orgRepository,
      maxPasswordAge,
      encryptPasswordKey
    );

    const organizationRegistrationService = new OrganizationRegistrationServiceImpl(
        inviteService,
        confirmMailService,
        userRepository,
        authenticationRepository,
        userRegistrationCodeRepository,
        identityRepository,
        orgRepository,
        maxPasswordAge,
        encryptPasswordKey
    );
    const organizationService = new OrganizationServiceImpl(orgRepository);
    const productsService = new ProductsServiceImpl(productsRepository);
    const itemService = new ItemServiceImpl(itemRepository);
    const consumerService = new ConsumerServiceImpl(consumerRepository);
    const giftService = new GiftServiceImpl(giftRepository);
    const loyaltyCardService = new LoyaltyCardServiceImpl(loyaltyCardRepository);
    const locationProductsService = new LocationProductsServiceImpl(locationProductsRepository);
    const userInfoServiceMongo = new UserInfoServiceImpl(userRepository, orgRepository, authenticationRepository, 5, 3);
    const authenticationService = new AuthenticationServiceImpl(userInfoServiceMongo, encryptPasswordKey, tokenSecret, tokenExpires);

    this.userRegistrationController = new UserRegistrationController(userRegistrationService);
    this.organizationRegistrationController = new OrganizationRegistrationController(organizationRegistrationService);
    this.organizationController = new OrganizationController(organizationService);
    this.productsController = new ProductsController(productsService);
    this.itemController = new ItemController(itemService);
    this.consumerController = new ConsumerController(consumerService);
    this.giftController = new GiftController(giftService);
    this.loyaltyCardController = new LoyaltyCardController(loyaltyCardService);
    this.locationProductsController = new LocationProductsController(locationProductsService);
    this.authenticationController = new AuthenticationController(authenticationService);
  }

  getUserRegistrationController(): UserRegistrationController {
    return this.userRegistrationController;
  }

  getOrganizationRegistrationController(): OrganizationRegistrationController {
    return this.organizationRegistrationController;
  }

  getOrganizationController(): OrganizationController {
    return this.organizationController;
  }

  getProductsController(): ProductsController {
    return this.productsController;
  }

  getItemController(): ItemController {
    return this.itemController;
  }

  getConsumerController(): ConsumerController {
    return this.consumerController;
  }

  getGiftController(): GiftController {
    return this.giftController;
  }

  getLoyaltyCardController(): LoyaltyCardController {
    return this.loyaltyCardController;
  }

  getLocationProductsController(): LocationProductsController {
    return this.locationProductsController;
  }

  getAuthenticationController(): AuthenticationController {
    return this.authenticationController;
  }

}
