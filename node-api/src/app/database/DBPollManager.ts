import * as mysql from "mysql";
import {Pool} from "mysql";
import config from "../../config/config.mysql.bill";
import {PoolConnection} from "mysql";

export default class DBPollManager {
    static _instance = new DBPollManager();

    static getInstance() {
        return DBPollManager._instance;
    }

    _connectPoll:Pool;

    constructor() {
        this._connectPoll = mysql.createPool({
            ...config,
            connectionLimit: 10,
            multipleStatements: true
        });
    }

    getConnection() {
        return new Promise<PoolConnection>((resolve, reject)=>{
            this._connectPoll.getConnection((err, connection)=>{
                if (err) {
                    reject(err);
                }else{
                    resolve(connection);
                }
            })
        });
    }
}
