import {ErrorMessage, MessageFactory} from '../../core';
import {OrganizationRegistration} from '../model/OrganizationRegistration';
import {UserRegistration} from '../model/UserRegistration';

export class ValidateUtil {
  private static EMAIL_REGEX = /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/i;

  public static validateUser(user: UserRegistration): Array<ErrorMessage> {
    return [].concat(
      ValidateUtil.validateUserName(user.userName),
      ValidateUtil.validateEmail(user.email),
      ValidateUtil.validatePassword(user.password)
    );
  }

  public static validateOrganization(organization: OrganizationRegistration): Array<ErrorMessage> {
    return [].concat(
        ValidateUtil.validateUserName(organization.userName),
        ValidateUtil.validateOrgName(organization.organizationName),
        ValidateUtil.validateOrgType(organization.organizationType),
        ValidateUtil.validateOrgAddress(organization.organizationAddress),
        ValidateUtil.validateEmail(organization.email),
        ValidateUtil.validatePassword(organization.password)
    );
  }

  private static validateOrgName(orgName: string): Array<ErrorMessage> {
    return []; // TODO
  }

  private static validateOrgType(orgName: string): Array<ErrorMessage> {
    return []; // TODO
  }

  private static validateOrgAddress(orgName: string): Array<ErrorMessage> {
    return []; // TODO
  }

  private static validateUserName(userName: string): Array<ErrorMessage> {
    return []; // TODO
  }

  private static validateEmail(email: string): Array<ErrorMessage> {
    if (ValidateUtil.EMAIL_REGEX.exec(email)) {
      return [];
    } else {
      return [MessageFactory.getEmailInvalid()];
    }
  }

  private static validatePassword(password: any): any {
    return []; // TODO
  }
}
