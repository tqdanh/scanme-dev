import {Observable, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {RxCacheManager} from '../../../common/cache/RxCacheManager';
import {StringUtil} from '../../../common/util/StringUtil';
import {Identity} from '../../model/Identity';
import {IdentityRepository} from '../../repository/IdentityRepository';
import {IdentityService} from '../IdentityService';

export class IdentityServiceImpl implements IdentityService {
    private identityRepository: IdentityRepository;
    private cacheManager: RxCacheManager<string, string>;

    constructor(identityRepository: IdentityRepository, cacheManager: RxCacheManager<string, string>) {
        this.identityRepository = identityRepository;
        this.cacheManager = cacheManager;
    }

    getIdentityKeysByIdentityId(identityId: string): Observable<Identity> {
        const redis_key = 'IDENTITY_KEYS_' + identityId;
        return this.cacheManager.get(redis_key).pipe(flatMap(identityKeys => {
            if (!identityKeys) {
                return this.identityRepository.findByIdentityId(identityId).pipe(flatMap(identity => {
                    const identityStr = JSON.stringify(identity);
                    return this.cacheManager.put(redis_key, identityStr).pipe(map(() => {
                        // console.log('put cache');
                        return identity;
                    }));
                }));
            } else {
                // console.log('hit cache');
                return of(JSON.parse(identityKeys));
            }
        }));
    }

    getPublicKeyByIdentityId(identityId: string): Observable<string> {
        const redis_key = 'IDENTITY_PUBLIC_KEY_' + identityId;
        return this.cacheManager.get(redis_key).pipe(flatMap(publicKey => {
            if (StringUtil.isEmpty(publicKey)) {
                return this.getIdentityKeysByIdentityId(identityId).pipe(flatMap(identity => {
                    const key = identity.publicKey;
                    return this.cacheManager.put(redis_key, key).pipe(map(() => {
                        // console.log('put cache');
                        return key;
                    }));
                }));
            } else {
                // console.log('hit cache');
                return of(publicKey);
            }
        }));
    }

    getPrivateKeyByIdentityId(identityId: string): Observable<string> {
        const redis_key = 'IDENTITY_PRIVATE_KEY_' + identityId;
        return this.cacheManager.get(redis_key).pipe(flatMap(privateKey => {
            if (StringUtil.isEmpty(privateKey)) {
                return this.getIdentityKeysByIdentityId(identityId).pipe(flatMap(identity => {
                    const key = identity.privateKey;
                    return this.cacheManager.put(redis_key, key).pipe(map(() => {
                        // console.log('put cache');
                        return key;
                    }));
                }));
            } else {
                // console.log('hit cache');
                return of(privateKey);
            }
        }));
    }


    getIdentityByUserId(userid: string): Observable<Identity> {
        const redis_key = 'IDENTITY_KEYS_' + userid;
        return this.cacheManager.get(redis_key).pipe(flatMap(identityKeys => {
            if (['undefined', null, ''].includes(identityKeys)) {
                return this.identityRepository.findByUserId(userid).pipe(flatMap(identity => {
                    const identityStr = JSON.stringify(identity);
                    return this.cacheManager.put(redis_key, identityStr).pipe(map(() => {
                        // console.log('put cache');
                        return identity;
                    }));
                }));
            } else {
                // console.log('hit cache');
                return of(JSON.parse(identityKeys));
            }
        }));
    }


    getPublicKeyByUserId(userId: string): Observable<string> {
        const redis_key = 'PUBLIC_KEY_' + userId;
        return this.cacheManager.get(redis_key).pipe(flatMap(publicKey => {
            if (!publicKey) {
                return this.getIdentityByUserId(userId).pipe(flatMap(identity => {
                    const key = identity.publicKey;
                    return this.cacheManager.put(redis_key, key).pipe(map(() => {
                        // console.log('put cache');
                        return key;
                    }));
                }));
            } else {
                // console.log('hit cache');
                return of(publicKey);
            }
        }));
    }

    getPrivateKeyByUserId(userId: string): Observable<string> {
        const redis_key = 'PRIVATE_KEY_OF_' + userId;
        return this.cacheManager.get(redis_key).pipe(flatMap(privateKey => {
            if (!privateKey) {
                return this.getIdentityByUserId(userId).pipe(flatMap(identity => {
                    const key = identity.privateKey;
                    return this.cacheManager.put(redis_key, key).pipe(map(() => {
                        // console.log('put cache');
                        return key;
                    }));
                }));
            } else {
                // console.log('hit cache');
                return of(privateKey);
            }
        }));
    }
}
