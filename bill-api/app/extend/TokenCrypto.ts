import * as crypto from "crypto";

export default class TokenCrypto {
    readonly secretKey;
    readonly expires = 8 * 60 * 60 * 1000;

    constructor(secretKey) {
        this.secretKey = secretKey;
    }

    createToken(userId): string {
        let str = JSON.stringify([userId,Date.now()+this.expires]);
        const cipher = crypto.createCipher('aes192', this.secretKey);
        let  token = cipher.update(str, 'utf8', 'hex');
        token +=  cipher.final('hex');
        return token;//编码方式从utf-8转为hex;
    }

    parseToken(token):[string,number]{
        const decipher = crypto.createDecipher('aes192', this.secretKey);
        let result = decipher.update(token, 'hex', 'utf8');
        result +=  decipher.final('utf8');
        return  JSON.parse(result);
    }
}