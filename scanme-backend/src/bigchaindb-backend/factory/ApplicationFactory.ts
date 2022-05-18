import {Bc, BigChainClient} from 'bigchaindb-driver';
import {Db} from 'mongodb';
import {RedisClient} from 'redis';
import {RedisCacheManager} from '../../common/cache/impl/RedisCacheManager';
import {ConsumerRepositoryImpl} from '../../org-bigchaindb-backend/repository/impl/ConsumerRepositoryImpl';
import {IdentityRepositoryImpl} from '../../org-bigchaindb-backend/repository/impl/IdentityRepositoryImpl';
import {ItemRepositoryImpl} from '../../org-bigchaindb-backend/repository/impl/ItemRepositoryImpl';
import {LocationProductsRepositoryImpl} from '../../org-bigchaindb-backend/repository/impl/LocationProductsRepositoryImpl';
import {LoyaltyCardRepositoryImpl} from '../../org-bigchaindb-backend/repository/impl/LoyaltyCardRepositoryImpl';
import {OrganizationRepositoryImpl} from '../../org-bigchaindb-backend/repository/impl/OrganizationRepositoryImpl';
import {ProductsRepositoryImpl} from '../../org-bigchaindb-backend/repository/impl/ProductsRepositoryImpl';
import {ConsumerServiceImpl} from '../../org-bigchaindb-backend/service/impl/ConsumerServiceImpl';
import {IdentityServiceImpl} from '../../org-bigchaindb-backend/service/impl/IdentityServiceImpl';
import {ItemServiceImpl} from '../../org-bigchaindb-backend/service/impl/ItemServiceImpl';
import {LocationProductsServiceImpl} from '../../org-bigchaindb-backend/service/impl/LocationProductsServiceImpl';
import {LoyaltyCardServiceImpl} from '../../org-bigchaindb-backend/service/impl/LoyaltyCardServiceImpl';
import {OrganizationServiceImpl} from '../../org-bigchaindb-backend/service/impl/OrganizationServiceImpl';
import {ProductsServiceImpl} from '../../org-bigchaindb-backend/service/impl/ProductsServiceImpl';
import {BigChainController} from '../controller/BigChainController';
import {CombineServciesController} from '../controller/CombineServciesController';
import {BigChainServiceImpl} from '../service/impl/BigChainServiceImpl';

export class ApplicationFactory {
  readonly bigChainController: BigChainController;
  readonly combineServicesController: CombineServciesController;
  constructor(
      conn: Bc,
      db: Db,
      redisClient: RedisClient
) {
    const organizationRepository = new OrganizationRepositoryImpl(db);
    const organizationService = new OrganizationServiceImpl(organizationRepository);
    const productsRepository = new ProductsRepositoryImpl(db);
    const itemRepository = new ItemRepositoryImpl(db);
    const locationProductsRepository = new LocationProductsRepositoryImpl(db);
    const loyaltyCardRepository = new LoyaltyCardRepositoryImpl(db);
    const consumerRepository = new ConsumerRepositoryImpl(db);
    const productsService = new ProductsServiceImpl(productsRepository);
    const itemService = new ItemServiceImpl(itemRepository);
    const locationProductsService = new LocationProductsServiceImpl(locationProductsRepository);
    const loyaltyService = new LoyaltyCardServiceImpl(loyaltyCardRepository);
    const consumerService = new ConsumerServiceImpl(consumerRepository);
    const bigChainService = new BigChainServiceImpl(conn, organizationService);
    const identityRepository = new IdentityRepositoryImpl(db);
    const cacheManager =  new RedisCacheManager(redisClient);
    const identityService = new IdentityServiceImpl(identityRepository, cacheManager);
    this.bigChainController = new BigChainController(bigChainService, identityService, organizationService, itemService);
    this.combineServicesController = new CombineServciesController(bigChainService, organizationService, productsService, itemService, loyaltyService, locationProductsService, consumerService);
  }
}
