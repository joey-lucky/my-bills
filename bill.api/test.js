var moment = require('moment');
var parser = require('cron-parser');
var interval = parser.parseExpression('0 0 9 * * *', {});


console.log('Date: ', moment(interval.next().toDate()).format("YYYY-MM-DD HH:mm:ss"));
console.log('Date: ', moment(interval.next().toDate()).format("YYYY-MM-DD HH:mm:ss"));
console.log('Date: ', moment(interval.next().toDate()).format("YYYY-MM-DD HH:mm:ss"));
console.log('Date: ', moment(interval.next().toDate()).format("YYYY-MM-DD HH:mm:ss"));
