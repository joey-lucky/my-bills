import {EggLogger} from 'egg-logger';

export default class Loggers {
    public request = new EggLogger({file: "logs/request.log", level: "ALL", consoleLevel: "ALL"});
    public initialize = new EggLogger({file: "logs/initialize.log", level: "ALL", consoleLevel: "ALL"});
    public schedule = new EggLogger({file: "logs/schedule.log", level: "ALL", consoleLevel: "ALL"});
}