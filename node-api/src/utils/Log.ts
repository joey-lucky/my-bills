import * as log4js from "log4js";

log4js.configure({
    appenders: {
        log: {type: 'console', category: "console", layout: {type: 'messagePassThrough'}},
        timeLog: {type: 'console', "category": "console", layout: {type: 'basic'}},
        timeLogColor: {type: 'console', "category": "console", layout: {type: 'coloured'}},
        file: {type: 'file', filename: 'logs/logs.log'}
    },
    categories: {
        sql: {appenders: ['log', 'file'], level: 'debug'},
        default: {appenders: ['timeLogColor', 'file'], level: 'info'}
    },
});

interface LogType extends log4js.Logger {
    sql?(message: any, ...args: any[]): void;
}
const Log: LogType = log4js.getLogger("default");

const sqlLog = log4js.getLogger("sql");
Log.sql = function (message: any, ...args: any[]) {
    sqlLog.info(message, ...args);
};
export default Log;