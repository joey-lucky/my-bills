import StringUtils from "./StringUtils";
import AssertError from "../model/AssertError";

export default class Assert {
    static hasText(str, msg) {
        Assert.isTrue(StringUtils.hasText(str), msg);
    }

    static notNull(str, msg) {
        Assert.isTrue(str, msg);
    }

    static isTrue(needTrue: boolean, msg) {
        if (!needTrue) {
            throw new AssertError(msg);
        }
    }
}