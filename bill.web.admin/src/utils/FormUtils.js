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

    static addDay = function(date, days) {
        let time = date.valueOf();
        time = time + days * 1000 * 60 * 60 * 24;
        let result = new Date(time);
        return result;
    }

    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 例子：
     * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
     */
    static formatDate = function(date, fmt) {
        if (!fmt) {
            fmt = "yyyy-MM-dd hh:mm:ss";
        }
        let dateInfo = {
            "M+": date.getMonth() + 1, // 月份
            "d+": date.getDate(), // 日
            "h+": date.getHours(), // 小时
            "m+": date.getMinutes(), // 分
            "s+": date.getSeconds(), // 秒
            "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
            "S": date.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in dateInfo) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (dateInfo[k]) : (("00" + dateInfo[k]).substr(("" + dateInfo[k]).length)));
            }
        }
        return fmt;
    }

    /**
     * 获取上一个月第一天与最后一天
     *
     * @date 格式为yyyy-mm-dd的日期字符串，如：2014-01-25
     * 返回数据格式：{firstDayOfPreMonth:"2019-01-01",lastDayOfPreMonth:"2019-01-31",month:"1"}
     */
    static getPreMonthDate() {
        let nowdays = new Date();
        let year = nowdays.getFullYear();
        let month = nowdays.getMonth();
        let monthTitle = "";
        if (month === 0) {
            month = 12;
            year = year - 1;
            monthTitle = month;
        }
        if (month < 10) {
            monthTitle = month;
            month = "0" + month;
        }
        let firstDayOfPreMonth = year + "-" + month + "-" + "01";// 上个月的第一天
        let lastDay = new Date(year, month, 0);
        let lastDayOfPreMonth = year + "-" + month + "-" + lastDay.getDate();// 上个月的最后一天

        return {firstDayOfPreMonth: firstDayOfPreMonth, lastDayOfPreMonth: lastDayOfPreMonth, monthText: monthTitle};
    }
    static getPreDate() {
        let curDate = new Date();
        let preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
        let dateStr = preDate.getFullYear() + "-" + (preDate.getMonth() + 1) + "-" + preDate.getDate();
        return dateStr;
    }
}
