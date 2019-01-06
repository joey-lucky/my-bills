import moment from "moment";

/**
 * 当表单数据某个key为空是，替换成初始化数据
 * @param data 表单数据
 * @param initValue 初始化数据
 */

export default class FormUtils {
    static concatInitialValue(data, initValue) {
        return {...initValue, ...data};
    }

    static getDateTimeInitValue(str) {
        return moment(str);
    }

    static getCurrDateTimeStr() {
        return moment().format("YYYY-MM-DD hh:mm:ss");
    }

    static getFormatDateTimeValues(values = {}, ids = []) {
        let formatValue = {};
        ids.forEach((item, index) => {
            formatValue[item] = values[item].format("YYYY-MM-DD hh:mm:ss");
        });
        return {...values, ...formatValue};
    }
}
