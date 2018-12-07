import DBPollManager from "./DBPollManager";
import Log from '../utils/log';
import {PoolConnection} from "mysql";

export default class DBManager {
    /**
     * 返回的数据不会为空
     */
    static async query(sql: string, params?: object) {
        Log.sql(sql);
        Log.sql("params", params || {});
        Log.info("SQL query...");
        let start = Date.now();
        return new Promise<any[]>(async (resolve, reject) => {
            try {
                let connection = await DBPollManager.getInstance().getConnection();
                connection.query(sql, params, (err, results = [], fields) => {
                    connection.release();
                    if (err) {
                        Log.info("SQL query失败", err.message);
                        reject(err);
                    } else {
                        Log.info("SQL query完成", "共" + results.length + "条", (Date.now() - start) + "ms");
                        resolve(results);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    static async update(tableName: string, data: object) {
        return new Promise((resolve, reject) => {

        });
    }

    static async insert(tableName: string, data: object) {
        return new Promise((resolve, reject) => {

        });
    }

    static async delete(tableName: string = "", id: string = "") {
        Log.info("table name", tableName, "id", id);
        let sql = `delete from ${tableName} where id = ? `;
        Log.info(sql);
        Log.info("SQL delete...");
        let start = Date.now();
        try {
            let connection:PoolConnection = await DBPollManager.getInstance().getConnection();
            connection.query(sql, [id], (err, results = [], fields) => {
                connection.release();
                if (err) {
                    Log.info("SQL query失败", err.message);
                    return err;
                } else {
                    Log.info("SQL query完成", "共" + results.length + "条", (Date.now() - start) + "ms");
                    return results;
                }
            });
        } catch (e) {
            return e;
        }
    }
}
