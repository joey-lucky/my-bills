import {Subscription} from 'egg';

export default class extends Subscription {
    static get schedule() {
        return {
            interval: '1m', // 1 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
            immediate: true,
        };
    }

    async subscribe() {
        let tableNames = await this.getAllTableNames();
        let tableForeignKeyMap = new Map();
        for (let tableName of tableNames) {
            let removeBcName = tableName.substr(3);
            tableForeignKeyMap.set(removeBcName + "_id", removeBcName + "_name");
        }
        this.app.cache.tableForeignKeyMap = tableForeignKeyMap;
    }

    async getAllTableNames() {
        let sql = "select distinct t.table_name\n" +
            "from information_schema.columns t\n" +
            "where table_schema = 'bill'";
        let data = await this.app.mysql.query(sql, []);
        return data.map((row) => row["table_name"]);
    }
}