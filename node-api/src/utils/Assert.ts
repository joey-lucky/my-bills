export default class Assert {
    public static isTrue(value: boolean, message?: string) {
        if (!value || value !== true) {
            this.throwError(message, "value has not text");
        }
    }

    public static hasText(value: string, message?: string) {
        if (!value || value.length === 0) {
            this.throwError(message, "value has not text");
        }
    }

    public static notNull(value: any, message?: string) {
        if (!value) {
            this.throwError(message, "value is null");
        }
    }

    public static notEmpty(value: any[] | Map<any, any> | Set<any>, message?: string) {
        let defMsg = "value is empty";
        if (!value) {
            this.throwError(message, defMsg);
        }
        if (Array.isArray(value)) {
            if (value.length === 0) {
                this.throwError(message, defMsg);
            }
        } else if (value instanceof Map) {
            if (value.size === 0) {
                this.throwError(message, defMsg);
            }
        } else if (value instanceof Set) {
            if (value.size === 0) {
                this.throwError(message, defMsg);
            }
        }
    }

    public static equal(value1: any,value2: any, message?: string) {
        if (!value1 || !value2 || JSON.stringify(value1) === JSON.stringify(value2)) {
            this.throwError(message,"value1 not equal value2")
        }
    }

    private static throwError(message: string, defMsg: string = ""): void {
        if (message) {
            throw new Error(message);
        } else {
            throw new Error(defMsg);
        }
    }
}