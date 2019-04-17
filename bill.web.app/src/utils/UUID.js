
export default class UUID {
    static randomUUID(len) {
        let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        let uuid = "";
        for (let i = 0; i < len; i++) {
            uuid += chars[0 | Math.random() * chars.length];
        }
        return uuid;
    }

    static randomGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}