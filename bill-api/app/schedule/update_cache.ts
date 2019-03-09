import {Subscription} from 'egg';

interface Table {
    tableName: string;
    columns: any[];
    dateTimeColumns: string[];
}


export default class extends Subscription {
    static get schedule() {
        return {
            interval: '1m', // 1 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
            immediate: true,
        };
    }

    async subscribe() {
        await this.updateBcCache();
        await this.updateForeignKey();
        await this.updateTableStructure();
    }

    private async updateTableStructure() {
        let result: Map<string, Table> = new Map<string, Table>();
        const {mysql} = this.app;
        let sql: string = "select t.column_name ,t.table_name ,t.data_type\n" +
            "from information_schema.columns t\n" +
            "where table_schema = 'bill'\n";
        let rows: any [] = await mysql.query(sql, []);
        for (let row of rows) {
            let tableName = row["table_name"];
            let table:Table|undefined = result.get(tableName);
            if (!table) {
                table = {
                    tableName:tableName,
                    columns:[],
                    dateTimeColumns:[]
                };
                result.set(tableName, table);
            }
            table.columns.push(row);
        }
        //处理dateTimeColumns
        for (let table of result.values()) {
            let columns = table.columns;
            table.dateTimeColumns = columns
                .filter((item) => item["data_type"] === "datetime" || item["data_type"] === "date")
                .map((item) => item["column_name"]);
        }
        this.app.mCache.set("tableStructure", result);
        this.app.loggers.logger.info("[schedule]", "app.cache.tableStructure refresh");
    }


    private async getAllBcTableNames(): Promise<string[]> {
        let sql = "select distinct t.table_name\n" +
            "from information_schema.columns t\n" +
            "where t.table_schema = 'bill'\n" +
            "  and t.table_name like 'bc_%'";
        const {sqlExecutor} = this.app;
        let rows: any[] = await sqlExecutor.query(sql, []);
        let tableNames: string[] = [];
        for (let row of rows) {
            tableNames.push(row["table_name"]);
        }
        return tableNames;
    }

    private async updateForeignKey() {
        const {mysql} = this.app;
        let tableNames: string[] = await this.getAllBcTableNames();
        let cache: Map<string, Map<string, object>> = new Map<string, Map<string, object>>();
        for (let tableName of tableNames) {
            let rows = await mysql.select(tableName);
            let foreignName = tableName.substr(3) + "_name";
            let foreignKey = tableName.substr(3) + "_id";
            let map = new Map<string, object>();
            for (let row of rows) {
                let id = row["id"];
                let name = row["name"];
                map.set(id, {[foreignName]: name})
            }
            cache.set(foreignKey, map);
        }
        this.app.mCache.set("bcForeignKey", cache);
        this.app.loggers.logger.info("[schedule]", "app.cache.bcForeignKey refresh");
    }

    private async updateBcCache() {
        const {mysql} = this.app;
        let tableNames: string[] = await this.getAllBcTableNames();
        let cache: Map<string, any[]> = new Map<string, any[]>();
        for (let tableName of tableNames) {
            let rows = await mysql.select(tableName);
            cache.set(tableName, rows);
        }
        this.app.mCache.set("bcTableCache", cache);
        this.app.loggers.logger.info("[schedule]", "app.cache.bcTableCache refresh");
    }
}