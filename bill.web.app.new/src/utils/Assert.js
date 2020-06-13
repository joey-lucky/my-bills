export default class Assert {

    static isTrue(value, msg) {
        if (!value) {
            throw new Error(msg || "expect true but false " + value);
        }
    }

    static notNull(value, msg) {
        if (value === null || value === undefined) {
            throw new Error(msg || "expect not null but " + value);
        }
    }

    static notEmpty(value, msg) {
        if (!value || !Array.isArray(value) || value.length === 0) {
            throw new Error(msg || "expect not empty but not " + value);
        }
    }

    static hasText(value, msg) {
        if (!value || typeof value !== "string" || value.length === 0) {
            throw new Error(msg || "expect has text but not " + value);
        }
    }

    static equal(expect, realValue, msg) {
        msg = msg || `expect value equal ${expect} but ${realValue}`;
        if (expect !== realValue) {
            throw new Error(msg);
        }
    }
}
