import * as crypto from "crypto";

export interface TokenObject {
    userId: string;
    expires: number;
}

export default class TokenCrypto {
    readonly secretKey;
    readonly expires = 30 * 24 * 60 * 60 * 1000;

    constructor(secretKey) {
        this.secretKey = secretKey;
    }

    public createToken(userId): string {
        let tokenObj: TokenObject = {userId, expires: Date.now()};
        let str = JSON.stringify(tokenObj);
        const cipher = crypto.createCipher('aes192', this.secretKey);
        let token = cipher.update(str, 'utf8', 'hex');
        token += cipher.final('hex');
        return token;//编码方式从utf-8转为hex;
    }

    public parseToken(token): TokenObject {
        const decipher = crypto.createDecipher('aes192', this.secretKey);
        let result = decipher.update(token, 'hex', 'utf8');
        result += decipher.final('utf8');
        return JSON.parse(result);
    }
}