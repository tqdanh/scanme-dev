import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import {Observable, of, zip} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import * as uuidv4 from 'uuid/v4';
import {UserStatus} from '../../../common/authentication/model/UserStatus';
import {IdentityRepository} from '../../repository/IdentityRepository';
import {OrganizationRepository} from '../../repository/OrganizationRepository';

import {BcryptUtil} from '../../../common/util/BcryptUtil';
import {CryptoUtil} from '../../../common/util/CryptoUtil';
import {DateUtil, MessageFactory, StringUtil} from '../../../core';
import {InviteService} from '../../../shared/invite-service';
import {ConfirmMailService} from '../../../shared/user-confirm-mail-service';
import {Authentication, User, UserSettings} from '../../../shared/user-model';
import {AuthenticationRepository, UserRepository} from '../../../shared/user-repository';
import {Organization} from '../../model/Organization';
import {OrganizationRegistration} from '../../model/OrganizationRegistration';
import {OrganizationRegistrationResult} from '../../model/OrganizationRegistrationResult';
import {UserRegistration} from '../../model/UserRegistration';
import {UserRegistrationResult} from '../../model/UserRegistrationResult';
import {UserRegistrationCodeRepository} from '../../repository/UserRegistrationCodeRepository';
import {ValidateUtil} from '../../util/ValidateUtil';
import {OrganizationRegistrationService} from '../OrganizationRegistrationService';
import {UserRegistrationService} from '../UserRegistrationService';
import {UserRegistrationServiceImpl} from './UserRegistrationServiceImpl';

export class OrganizationRegistrationServiceImpl extends UserRegistrationServiceImpl implements OrganizationRegistrationService {

    registerOrganization(organizationRegistration: OrganizationRegistration): Observable<OrganizationRegistrationResult> {
        const result: OrganizationRegistrationResult = {
            success: false,
            errors: []
        };

        // Will handle if password sent from client is encrypted
        // if (this.encryptPasswordKey.length > 0) {
        //   const decodedPassword = CryptoUtil.decryptRC4(CryptoJS, organizationRegistration.password, this.encryptPasswordKey);
        //
        //   if (decodedPassword) {
        //     organizationRegistration.password = decodedPassword;
        //   } else {
        //     result.success = false;
        //     result.errors.push(MessageFactory.getCannotDecodePassword());
        //     return of(result);
        //   }
        // }

        result.errors = ValidateUtil.validateOrganization(organizationRegistration);

        if (result.errors.length > 0) {
            result.success = false;
            return of(result);
        }

        organizationRegistration.email = organizationRegistration.email.toLowerCase();

        return this.organizationRepository.findByEmail(organizationRegistration.email).pipe(flatMap(orgs => {
            for (const org of Object.keys(orgs)) {
                if (orgs[org].email === organizationRegistration.email) {
                    result.errors.push(MessageFactory.getEmailAlreadyInUse());
                }
                if (orgs[org].organizationName === organizationRegistration.organizationName) {
                    result.errors.push(MessageFactory.getUsernameAlreadyInUse());
                }
            }

            if (result.errors.length > 0) {
                result.success = false;
                return of(result);
            }

            return this.insertOrgToDatabase(organizationRegistration).pipe(map(success => {
                result.success = success;
                return result;
            }));
        }));
    }

    private insertOrgToDatabase(organization: OrganizationRegistration): Observable<boolean> {
        const organizationId = StringUtil.uuid(uuidv4);
        const userId = StringUtil.uuid(uuidv4);

        return zip(
            this.insertOrganization(organization, organizationId),
            this.insertUser(organization, userId, organizationId),
            this.insertAuthentication(organization, userId),
        ).pipe(flatMap(([dbOrg, dbUser, authentication]) => {
            return this.confirmMailService.send(dbUser, dbOrg);
            // return this.inviteService.moveToAuthorization(organization.email, userId).pipe(flatMap(() => {
            //     return this.confirmMailService.send(dbUser, dbOrg);
            // }));
        }));
    }

    private insertOrganization(organizationRegistration: OrganizationRegistration, organizationId: string): Observable<Organization> {
        const organization = new Organization();
        organization.organizationId = organizationId;
        organization.organizationName = organizationRegistration.organizationName;
        organization.organizationType = organizationRegistration.organizationType;
        organization.organizationAddress = organizationRegistration.organizationAddress;
        organization.organizationPhone = organizationRegistration.organizationPhone;
        organization.email = organizationRegistration.email;
        organization.status = UserStatus.Registered;
        organization.identityId = '';
        return this.organizationRepository.insert(organization);
    }
}
