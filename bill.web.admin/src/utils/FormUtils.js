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

    static addDay = function (date, days) {
        let time = date.valueOf();
        time = time + days * 1000 * 60 * 60 * 24;
        let result = new Date(time);
        return result;
    };

    static lessHour = function (date, hours) {
        let time = date.valueOf();
        time = time - hours * 1000 * 60 * 60;
        let result = new Date(time);
        return result;
    };

    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 例子：
     * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
     */
    static formatDate = function (date, fmt) {
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
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (dateInfo[k]) : (("00" + dateInfo[k]).substr(("" + dateInfo[k]).length)));
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
        let firstDayOfPreMonth = `${year}-${month}-01`;// 上个月的第一天
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

    /**
     * data 数据结构为
     * {
     *     ID：xxx
     *     ...
     *     children:[
     *         {
     *             ID:xxx
     *             .....
     *         }
     *     ]
     * }
     */
    static completeKeyField(data = []) {
        data.forEach((item) => {
            item.key = item.ID;
            this.completeKeyField(item.children);
        });
    }

    // 去除字符串两侧的空格
    static trimAroundSpace(obj = {}) {
        let result = {};
        Object.entries(obj).forEach((item) => {
            let key = item[0];
            let value = item[1];
            if (typeof value === "string") {// 去除所有的空格
                value = value.replace(/(^\s+)|(\s+$)/g, "");
            }
            result[key] = value;
        });
        return result;
    }

    /**
     * 获取一个月有几天
     * dateStr: "2019-10-01"
     * @returns {number}
     */
    static getCountDays(dateStr = "") {
        // var curDate = new Date();
        let dateArr = dateStr.split(separator);
        let year = parseInt(dateArr[0]);
        let month;
        if(dateArr[1].indexOf("0") == 0){
            month = parseInt(dateArr[1].substring(1));
        }else{
            month = parseInt(dateArr[1]);
        }
        let day = parseInt(dateArr[2]);
        let curDate = new Date(year,month -1,day);
        /* 获取当前月份 */
        let curMonth = curDate.getMonth();
        /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
        curDate.setMonth(curMonth + 1);
        /* 将日期设置为0setDate()方法用来设置日期时间中的日，也就是每个月中的几号，传入参数为1~31的整数。若是传入的值超出当前月份的正常范围，setDate()方法也会依据超出的数值进行计算，
          比如setDate(0)会让日期变为上一个月的最后一天，setDate(-1)会让日期变为上一个月的倒数第二天，若当月有31天，那么setDate(32)会让日期变为下一个月的第一天 */
        curDate.setDate(0);
        /* 返回当月的天数 */
        return curDate.getDate();
    }
}
