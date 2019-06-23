import AssertError from "../model/AssertError";
import StringUtils from "./StringUtils";

export default class Assert {
    static hasText(str, msg = "expect has text but text is null") {
        Assert.isTrue(StringUtils.hasText(str), msg);
    }

    static notNull(str, msg = "expect not null but null") {
        Assert.isTrue(str, msg);
    }

    static isTrue(needTrue: boolean, msg = "expect true but false") {
        if (!needTrue) {
            throw new AssertError(msg);
        }
    }

    static equal(obj1, obj2, msg = "expect equal but different") {
        if (obj1 !== obj2) {
            throw new AssertError(msg);
        }
    }
}