import {EditPermissionBuilder, LocaleModelFormatter, SearchPermissionBuilder} from '../../core';
import {MasterDataService, MasterDataServiceImpl} from '../../shared/master-data';
import {ODDEditPermissionBuilder} from '../../shared/permission/ODDEditPermissionBuilder';
import {ODDSearchPermissionBuilder} from '../../shared/permission/ODDSearchPermissionBuilder';
import {OrganizationServiceImpl} from '../service/Impl/OrganizationServiceImpl';
import { SupplyChainServiceImpl } from '../service/Impl/SupplyChainServiceImpl';
import {OrganizationService} from '../service/OrganizationService';
import {SupplyChainService} from '../service/SupplyChainService';
import {ProductService} from '../service/ProductService';
import {ProductServiceImpl} from '../service/Impl/ProductServiceImpl';
import {ItemService} from '../service/ItemService';
import {ItemServiceImpl} from '../service/Impl/ItemServiceImpl';
import {ProviderService} from '../service/ProviderService';
import {ProviderServiceImpl} from '../service/Impl/ProviderServiceImpl';

class ApplicationContext {
  private readonly businessSearchModelFormatter: LocaleModelFormatter<any, any>;
  private readonly editPermissionBuilder: EditPermissionBuilder;
  private readonly searchPermissionBuilder: SearchPermissionBuilder;
  private readonly masterDataService: MasterDataService;
  private readonly supplyChainService: SupplyChainService;
  private readonly organizationService: OrganizationService;
  private readonly productService: ProductService;
  private readonly itemService: ItemService;
  private readonly providerService: ProviderService;
  constructor() {
    this.editPermissionBuilder = new ODDEditPermissionBuilder();
    this.searchPermissionBuilder = new ODDSearchPermissionBuilder();
    this.masterDataService = new MasterDataServiceImpl();
    this.supplyChainService = new SupplyChainServiceImpl();
    this.organizationService = new OrganizationServiceImpl();
    this.productService = new ProductServiceImpl();
    this.itemService = new ItemServiceImpl();
    this.providerService = new ProviderServiceImpl();
  }

  getBusinessSearchModelFormatter(): LocaleModelFormatter<any, any> {
    return this.businessSearchModelFormatter;
  }

  getEditPermissionBuilder(): EditPermissionBuilder {
    return this.editPermissionBuilder;
  }

  getSearchPermissionBuilder(): SearchPermissionBuilder {
    return this.searchPermissionBuilder;
  }

  getMasterDataService(): MasterDataService {
    return this.masterDataService;
  }

  getSupplyChainService(): SupplyChainService {
    return this.supplyChainService;
  }

  getOrganizationService(): OrganizationService {
    return this.organizationService;
  }

  getProductService(): ProductService {
    return this.productService;
  }

  getItemService(): ItemService {
    return this.itemService;
  }

  getProviderService(): ProviderService {
    return this.providerService;
  }
}

const applicationContext = new ApplicationContext();

export default applicationContext;
