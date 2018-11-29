import * as mysql from "mysql";
import DBPollManager from "./DBPollManager";
import {MysqlError} from "mysql";
import {FieldInfo} from "mysql";

export default class DBManager {
    static async query(sql: string, params?: object) {
        return new Promise(async (resolve, reject) => {
            try {
                let connection = await DBPollManager.getInstance().getConnection();
                connection.query(sql, params, (err, results, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    static update(tableName: string, data: object) {
        return new Promise((resolve, reject) => {

        });
    }

    static insert(tableName: string, data: object) {
        return new Promise((resolve, reject) => {

        });
    }

    static delete(tableName: string, data: object) {
        return new Promise((resolve, reject) => {

        });
    }
}
