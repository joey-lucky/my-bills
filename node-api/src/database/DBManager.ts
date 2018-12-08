import DBPollManager from "./DBPollManager";
import Log from '../utils/log';
import {PoolConnection} from "mysql";
import TableStructureCache from "../schedule/TableStructureCache";
import * as UUID from "node-uuid";
import Table, {DataType} from "./Table";
import Assert from "../utils/Assert";

export default class DBManager {
    public static query(sql: string, params: any[] = []): Promise<any[]> {
        return new Promise<any[]>(async (resolve, reject) => {
            try {
                let start = Date.now();
                let connection = await DBPollManager.getInstance().getConnection();
                let results = await this.execute(sql, params, connection);
                connection.release();
                Log.sql(sql);
                if (params && params.length > 0) {
                    Log.sql(params);
                }
                Log.info(`SQL query finish length=${results.length} (${(Date.now() - start)}ms)`);
                resolve(results);
            } catch (e) {
                reject(e);
            }
        });
    }

    public static insert(tableName: string, data: any[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let table = TableStructureCache.getTableStructure(tableName);
            if (table == null) {
                return reject("表名有误");
            } else {
                let start = Date.now();
                let connection = await DBPollManager.getInstance().getConnection();
                connection.beginTransaction(async (err) => {
                    if (err) {
                        throw new Error("connection begin transaction error \n" + err.message);
                    }
                    let sqlArrays = [];
                    for (let item of data) {
                        let sql = DBManager.getInsertSql(table, item);
                        sqlArrays.push(sql);
                    }
                    try {
                        for (let sql of sqlArrays) {
                            await this.execute(sql, [], connection);
                        }
                        connection.commit();
                        connection.release();
                        for (let sql of sqlArrays) {
                            Log.sql(sql);
                        }
                        Log.info(`SQL inserts finish (${(Date.now() - start)}ms)`);
                        resolve(true);
                    } catch (e) {
                        connection.rollback();
                        reject(e);
                    }
                });
            }
        });
    }

    public static update(tableName: string, data: any[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                let table = TableStructureCache.getTableStructure(tableName);
                Assert.notNull(table, "表名有误");
                let start = Date.now();
                let connection = await DBPollManager.getInstance().getConnection();
                connection.beginTransaction(async (err) => {
                    try {
                        if (err) {
                            throw new Error("connection begin transaction error \n" + err.message);
                        }
                        let sqlArrays = [];
                        for (let item of data) {
                            let sql = DBManager.getUpdateSql(table, item);
                            sqlArrays.push(sql);
                        }
                        for (let sql of sqlArrays) {
                            await this.execute(sql, [], connection);
                        }
                        connection.commit();
                        connection.release();
                        for (let sql of sqlArrays) {
                            Log.sql(sql);
                        }
                        Log.info(`SQL inserts finish (${(Date.now() - start)}ms)`);
                        resolve(true);
                    } catch (e) {
                        connection.rollback();
                        reject(e);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    public static delete(tableName: string = "", id: string = ""): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let sql = `delete from ${tableName} where id = ? `;
            Log.sql(sql);
            let start = Date.now();
            try {
                let connection: PoolConnection = await DBPollManager.getInstance().getConnection();
                await this.execute(sql, [id], connection);
                connection.release();
                Log.info(`SQL delete finish (${(Date.now() - start)}ms)`);
                resolve(true);
            } catch (e) {
                reject(e);
            }
        });
    }

    private static getInsertSql(table: Table, data: any) {
        let {fields = []} = table;
        Assert.notEmpty(fields, "table fields is empty");
        data.id = data.id || UUID.v1();
        let fieldSql = "";
        let valueSql = "";
        for (let field of fields) {
            fieldSql += field.name + ",";
            if (DataType.isVarchar(field.dataType)) {
                let value = data[field.name] || "";
                valueSql += `'${value}',`
            }
        }
        if (fieldSql.length > 0) {
            fieldSql = fieldSql.substr(0, fieldSql.length - 1);
            valueSql = valueSql.substr(0, valueSql.length - 1);
            return `insert into ${table.tableName} (${fieldSql}) value (${valueSql})`;
        } else {
            return "";
        }
    }

    private static getUpdateSql(table: Table, data: any) {
        let {fields = []} = table;
        Assert.notEmpty(fields, "table fields is empty");
        Assert.hasText(data.id, "primary key id can not null");
        let partSql = "set ";
        for (let field of fields) {
            let fieldName = field.name;
            if (fieldName !== "id" && data[fieldName]) {
                partSql += `${fieldName}='${data[fieldName]}',`;
            }
        }
        if (partSql.length > 0) {
            partSql = partSql.substr(0, partSql.length - 1);
            return `update ${table.tableName} ${partSql} where id='${data.id}'`;
        } else {
            return "";
        }
    }

    private static execute(sql: string = "", params: any[] = [], connection: any): Promise<any[]> {
        return new Promise<any[]>(async (resolve, reject) => {
            try {
                connection.query(sql, params, (err, results = [], fields) => {
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
}
