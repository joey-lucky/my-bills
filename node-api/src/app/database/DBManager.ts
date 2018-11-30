import DBPollManager from "./DBPollManager";

export default class DBManager {

    /**
     * 返回的数据不会为空
     */
    static async query(sql: string, params?: object) {
        console.log("query start",sql, params || {});
        return new Promise<any[]>(async (resolve, reject) => {
            try {
                let connection = await DBPollManager.getInstance().getConnection();
                connection.query(sql, params, (err, results = [], fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("query start",sql, params || {},"result:",results.length);
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
