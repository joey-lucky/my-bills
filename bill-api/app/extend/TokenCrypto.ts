import * as crypto from "crypto";
import {Cipher, Decipher} from "crypto";

export default class TokenCrypto {
    readonly secretKey;
    readonly cipher: Cipher;
    readonly decipher: Decipher;
    readonly expires = 8 * 60 * 60 * 1000;

    constructor(secretKey) {
        this.secretKey = secretKey;
        this.cipher = crypto.createCipher('aes192', secretKey);
        this.decipher = crypto.createDecipher('aes192', secretKey);
    }

    createToken(userId): string {
        let str = JSON.stringify([userId,Date.now()+this.expires]);
        let  token = this.cipher.update(str, 'utf8', 'hex');
        token +=  this.cipher.final('hex');
        return token;//编码方式从utf-8转为hex;
    }

    parseToken(token):[string,number]{
        console.log(token);
        let result = this.decipher.update(token, 'hex', 'utf8');
        result +=  this.decipher.final('utf8');
        return  JSON.parse(result);
    }
}