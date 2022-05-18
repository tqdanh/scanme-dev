import {AuthenticationService} from '../service/AuthenticationService';
import {AuthenticationServiceImpl} from '../service/impl/AuthenticationServiceImpl';

class ApplicationContext {
  private readonly authenticationService: AuthenticationService;

  constructor() {
    this.authenticationService = new AuthenticationServiceImpl();
  }
  getAuthenticationService(): AuthenticationService {
    return this.authenticationService;
  }
}

const applicationContext = new ApplicationContext();

export default applicationContext;
