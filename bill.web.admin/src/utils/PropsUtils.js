
export default class PropsUtils {
    // 比较两个对象中的某个key，是否相等。
    static isEqual(obj1, obj2, key) {
        let propsValue = obj1[key];
        let nextPropsValue = obj2[key];
        if (propsValue !== nextPropsValue) {
            if (!propsValue || !nextPropsValue) {// 如果有一个为空（另一个肯定不为空，因为不相等），返回false
                return false;
            } else if (typeof nextPropsValue === "string") { // 不相同的字符串
                return false;
            } else if (propsValue instanceof Date) {// 对象，则需要解析并判断
                if (!(nextPropsValue instanceof Date)) {
                    return false;
                }else {
                    return propsValue.getTime() === nextPropsValue.getTime();
                }
            }else {
                return JSON.stringify(propsValue) === JSON.stringify(nextPropsValue);
            }
        } else {
            return true;
        }
    }

}
