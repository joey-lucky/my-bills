export default class TokenError extends Error {
    static hasText(token): void {
        if (!token) {
            throw new TokenError("token is null")
        }
    };

    static available(expires): void {
        if (Date.now() < expires) {
            throw new TokenError("token is expires");
        }
    };

    constructor(message: string = "token is error") {
        super(message);
    }
}