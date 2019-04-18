
export class UUID {
    static randomUUID(len) {
        let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        let uuid = "";
        for (let i = 0; i < len; i++) {
            uuid += chars[0 | Math.random() * chars.length];
        }
        return uuid;
    }
}
