import {Subscription} from 'egg';
import {TableCache} from "../../typings";
import Table from "../../../node-api/src/database/Table";

export default class extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '1m', // 1 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
            immediate: true,
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        let bcTableCache: TableCache = {};
        let tableNames = await this.getAllTableNames();
        for (let tableName of tableNames) {
            let keyTable: { [key: string]: Table } = {};
            let rows = await this.app.mysql.select(tableName);
            for (let row of rows) {
                keyTable[row["id"]] = row;
            }
            bcTableCache[tableName] = keyTable;
        }
        this.app.cache.bcTableCache = bcTableCache;
    }

    async getAllTableNames() {
        let sql = "select distinct t.table_name\n" +
            "from information_schema.columns t\n" +
            "where table_schema = 'bill'";
        let data = await this.app.mysql.query(sql, []);
        return data.map((row) => row["table_name"]);
    }
}

