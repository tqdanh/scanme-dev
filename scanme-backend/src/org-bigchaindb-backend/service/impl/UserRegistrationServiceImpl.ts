import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import {Observable, of, zip} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import * as uuidv4 from 'uuid/v4';
import MyEd25519Keypair from '../../../bigchaindb-backend/util/MyEd25519Keypair';
import {UserStatus} from '../../../common/authentication/model/UserStatus';
import {BcryptUtil} from '../../../common/util/BcryptUtil';
import {CryptoUtil} from '../../../common/util/CryptoUtil';
import {DateUtil, MessageFactory, StringUtil} from '../../../core';
import {InviteService} from '../../../shared/invite-service';
import {ConfirmMailService} from '../../../shared/user-confirm-mail-service';
import {Authentication, User, UserSettings} from '../../../shared/user-model';
import {AuthenticationRepository, UserRepository} from '../../../shared/user-repository';
import {Identity} from '../../model/Identity';
import {UserRegistration} from '../../model/UserRegistration';
import {UserRegistrationForOrganization} from '../../model/UserRegistrationForOrganization';
import {UserRegistrationResult} from '../../model/UserRegistrationResult';
import {IdentityRepository} from '../../repository/IdentityRepository';
import {OrganizationRepository} from '../../repository/OrganizationRepository';
import {UserRegistrationCodeRepository} from '../../repository/UserRegistrationCodeRepository';
import {ValidateUtil} from '../../util/ValidateUtil';
import {UserRegistrationService} from '../UserRegistrationService';

export class UserRegistrationServiceImpl implements UserRegistrationService {
    constructor(
        protected inviteService: InviteService,
        protected confirmMailService: ConfirmMailService,
        protected userRepository: UserRepository,
        protected authenticationRepository: AuthenticationRepository,
        protected userRegistrationCodeRepository: UserRegistrationCodeRepository,
        protected identityRepository: IdentityRepository,
        protected organizationRepository: OrganizationRepository,
        protected maxPasswordAge: number,
        protected encryptPasswordKey: string
    ) {
    }

    registerUser(userRegistration: UserRegistrationForOrganization): Observable<UserRegistrationResult> {
        // Check user is admin
        return this.userRepository.getById(userRegistration.adminId).pipe(flatMap(userAdmin => {
            const result: UserRegistrationResult = {
                success: false,
                errors: []
            };
            const roles = userAdmin.roles;
            if (!roles.includes('admin')) {
                result.success = false;
                return of(result);
            }
            // if (this.encryptPasswordKey.length > 0) {
            //     const decodedPassword = CryptoUtil.decryptRC4(CryptoJS, userRegistration.password, this.encryptPasswordKey);
            //
            //     if (decodedPassword) {
            //         userRegistration.password = decodedPassword;
            //     } else {
            //         result.success = false;
            //         result.errors.push(MessageFactory.getCannotDecodePassword());
            //         return of(result);
            //     }
            // }

            result.errors = ValidateUtil.validateUser(userRegistration);

            if (result.errors.length > 0) {
                result.success = false;
                return of(result);
            }

            userRegistration.email = userRegistration.email.toLowerCase();
            const organizationId = userAdmin.organizationId;

            return this.userRepository.findByUserNameOrEmail(userRegistration.email).pipe(flatMap(users => {
                for (const user of users) {
                    if (user.email === userRegistration.email) {
                        result.errors.push(MessageFactory.getEmailAlreadyInUse());
                    }
                    if (user.userName === userRegistration.userName) {
                        result.errors.push(MessageFactory.getUsernameAlreadyInUse());
                    }
                }

                if (result.errors.length > 0) {
                    result.success = false;
                    return of(result);
                }

                return this.insertToDatabase(userRegistration, organizationId).pipe(map(success => {
                    result.success = success;
                    return result;
                }));
            }));
        }));
    }

    private insertToDatabase(user: UserRegistrationForOrganization, organizationId: string): Observable<boolean> {
        const userId = StringUtil.uuid(uuidv4);
        return zip(
            this.insertUser(user, userId, organizationId),
            this.insertAuthentication(user, userId),
            // this.insertUserSettings(userId)
        ).pipe(flatMap(([dbUser, authentication]) => {
            return this.confirmMailService.send(dbUser);
            // return this.inviteService.moveToAuthorization(user.email, userId).pipe(flatMap(() => {
            //     return this.confirmMailService.send(dbUser);
            // }));
        }));
    }

    protected insertUser(userRegistration: UserRegistration, userId: string, organizationId: string): Observable<User> {
        const user = new User();
        user.userId = userId;
        user.userName = userRegistration.userName;
        user.email = userRegistration.email;
        user.status = UserStatus.Registered;
        user.maxPasswordAge = this.maxPasswordAge;
        user.firstName = userRegistration.firstName;
        user.lastName = userRegistration.lastName;
        user.displayName = userRegistration.displayName;
        user.gender = userRegistration.gender;
        user.dateOfBirth = userRegistration.dateOfBirth;
        user.organizationId = organizationId;
        user.settings = new UserSettings(userId);
        return this.userRepository.insert(user);
    }

    protected insertAuthentication(user: UserRegistration, userId: string): Observable<Authentication> {
        return BcryptUtil.generateHashCode(bcrypt, user.password).pipe(flatMap(encodedPassword => {
            const auth = new Authentication();
            auth.userId = userId;
            auth.password = encodedPassword;
            auth.passwordModifiedTime = DateUtil.now();
            auth.failCount = 0;
            auth.lockedUntilTime = null;
            return this.authenticationRepository.insert(auth);
        }));
    }

    // hackUserPass(userId: string, password: string): Observable<any> {
    //     return BcryptUtil.generateHashCode(bcrypt, password).pipe(flatMap(encodedPassword => {
    //         const auth = new Authentication();
    //         auth.userId = userId;
    //         auth.password = encodedPassword;
    //         auth.passwordModifiedTime = DateUtil.now();
    //         auth.failCount = 0;
    //         auth.lockedUntilTime = null;
    //         return this.authenticationRepository.update(auth);
    //     }));
    // }

    confirmOrg(userId: string, passcode: string): Observable<any> {
        return this.userRegistrationCodeRepository.getById(userId).pipe(flatMap(userRegistrationCode => {
            const result: UserRegistrationResult = {
                success: false,
                errors: []
            };
            if (!userRegistrationCode || userRegistrationCode.expiredDateTime.getTime() < new Date().getTime()) {
                return of(false);
            } else {
                return BcryptUtil.compare(bcrypt, passcode, userRegistrationCode.passcode).pipe(flatMap(isEqual => {
                    if (!isEqual) {
                        result.success = false;
                        return of(result);
                    } else {
                        return this.insertDbIdentityUpdateStatus(userId).pipe(map(success => {
                            result.success = true;
                            return result;
                        }));
                    }
                }));
            }
        }));
    }

    private insertDbIdentityUpdateStatus(userId: string): Observable<any> {
        return this.userRepository.getById(userId).pipe(flatMap(userObject => {
            const organizationId = userObject.organizationId;
            const identityId = StringUtil.uuid(uuidv4);
            const identityGenenation = MyEd25519Keypair(organizationId);
            return zip(
                this.insertIdentity(identityGenenation, identityId),
                this.checkAdminAlreadyActivated(userId),
                this.checkOrgAlreadyActivatedAddIdentityId(organizationId, identityId),
            ).pipe(flatMap(([dbIdentity, userAlreadyActivated, orgAlreadyActivatedAddIdentityId]) => {
                if (dbIdentity && userAlreadyActivated && orgAlreadyActivatedAddIdentityId) {
                    return of(true);
                } else {
                    return of(false);
                }
            }));
        }));
    }

    private insertIdentity(identityGenenation, identityId: string): Observable<Identity> {
        const identity = new Identity();
        identity.identityId = identityId;
        identity.privateKey = identityGenenation.privateKey;
        identity.publicKey = identityGenenation.publicKey;
        return this.identityRepository.insert(identity);
    }

    private checkAdminAlreadyActivated(userId: string): Observable<boolean> {
        return this.userRepository.getById(userId).pipe(flatMap(user => {
            if (!user) {
                return of(false);
            } else if (user.status === UserStatus.Registered) {
                user.status = UserStatus.Activated;
                user.roles = ['admin'];
                return this.userRepository.update(user).pipe(map(() => {
                    return true;
                }));
            }
        }));
    }

    private checkOrgAlreadyActivatedAddIdentityId(organizationId: string, identityId: string): Observable<boolean> {
        return this.organizationRepository.getById(organizationId).pipe(flatMap(org => {
            if (!org) {
                return of(false);
            } else if (org.status === UserStatus.Registered) {
                org.status = UserStatus.Activated;
                org.identityId = identityId;
                return this.organizationRepository.update(org).pipe(map(() => {
                    return true;
                }));
            }
        }));
    }

    confirmUser(userId: string, passcode: string): Observable<boolean> {
        return this.userRegistrationCodeRepository.getById(userId).pipe(flatMap(userRegistrationCode => {
            if (!userRegistrationCode || userRegistrationCode.expiredDateTime.getTime() < new Date().getTime()) {
                return of(false);
            } else {
                return BcryptUtil.compare(bcrypt, passcode, userRegistrationCode.passcode).pipe(flatMap(isEqual => {
                    if (!isEqual) {
                        return of(false);
                    } else {
                        return this.checkUserAlreadyActivated(userId);
                    }
                }));
            }
        }));
    }

    private checkUserAlreadyActivated(userId): Observable<boolean> {
        return this.userRepository.getById(userId).pipe(flatMap(user => {
            if (!user) {
                return of(false);
            } else if (user.status === UserStatus.Registered) {
                user.status = UserStatus.Activated;
                user.roles = ['user'];
                return this.userRepository.update(user).pipe(map(() => {
                    return true;
                }));
            } else {
                return of(false);
            }
        }));
    }

}
