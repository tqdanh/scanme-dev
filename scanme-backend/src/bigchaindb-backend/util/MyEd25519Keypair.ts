const Base58 = require('bs58');
import * as bip39 from 'bip39';
import * as nacl from 'tweetnacl';

/**
 * @public
 * Ed25519 keypair in base58 (as BigchainDB expects base58 keys)
 * @type {Object}
 * @param {Buffer} [seed] A seed (32 bytes) that will be used as a key derivation function
 * @property {string} publicKey
 * @property {string} privateKey
 */
export default function MyEd25519Keypair(seed?: any) {
    const seedStrHex = bip39.mnemonicToSeedSync(seed).toString('hex');
    const resultArr = [];
    for (let i = 0; i < seedStrHex.length; i += 2) {
        resultArr.push(parseInt(seedStrHex.substring(i, i + 2), 16));
    }
    let result32Uint8Array = Uint8Array.from(resultArr);
    result32Uint8Array = result32Uint8Array.slice(0, 32);
    const keyPair = result32Uint8Array ? nacl.sign.keyPair.fromSeed(result32Uint8Array) : nacl.sign.keyPair();
    this.publicKey = Base58.encode(Buffer.from(keyPair.publicKey));
    this.privateKey = Base58.encode(Buffer.from(keyPair.secretKey.slice(0, 32)));
    return {publicKey: this.publicKey, privateKey: this.privateKey};
}

