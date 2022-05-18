export class CryptoUtil {
    public static decryptRC4(CryptoJS, base64CipherText: string, secretKey: string): string {
        const encryptedMessage: any = {
            ciphertext: CryptoJS.enc.Base64.parse(base64CipherText)
        };

        try {
            const plainText = CryptoJS.RC4.decrypt(encryptedMessage, CryptoJS.enc.Utf8.parse(secretKey));
            return plainText.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            return null;
        }
    }

    public static encryptRC4(CryptoJS, plainText: string, secretKey: string): string {
        const cipherText = CryptoJS.RC4.encrypt(plainText, CryptoJS.enc.Utf8.parse(secretKey)).ciphertext;
        return cipherText.toString(CryptoJS.enc.Base64);
    }
}
