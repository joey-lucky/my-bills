import StringUtils from "./StringUtils";

export default class Assert {
    static hasText(str, msg) {
        Assert.isTrue(StringUtils.hasText(str), msg);
    }

    static notNull(str, msg) {
        Assert.isTrue(str, msg);
    }

    static isTrue(needTrue: boolean, msg) {
        if (!needTrue) {
            throw new Error(msg);
        }
    }
}