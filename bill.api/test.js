const moment = require("moment");

console.log(moment().startOf("week").format("YYYYMMDD HHmmss"));
let weekOfDay = Number.parseInt(moment("2018-10-29", 'YYYY-MM-DD').format('E'));//计算指定日期是这周第几天
let start = moment().subtract(weekOfDay - 1, 'days');//周一日期
let end = moment().add(7 - weekOfDay, 'days');//周日日期


console.log(start.format("YYYYMMDD HHmmss"),end.format("YYYYMMDD HHmmss"))