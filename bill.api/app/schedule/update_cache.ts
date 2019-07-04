import {Subscription} from "egg";
import {ForeignKeyData} from "../typings/appCache";
import Table from "../typings/Table";

export default class UpdateCache extends Subscription {
    static get schedule() {
        return {
            interval: "1m", // 1 分钟间隔
            type: "all", // 指定所有的 worker 都需要执行
            immediate: true,
        };
    }

    async subscribe() {
        await this.updateBcCache();
        await this.updateForeignKey();
        await this.updateTableStructure();
    }

    private async updateTableStructure() {
        const result: Map<string, Table> = new Map<string, Table>();
        const {mysql} = this.app;
        const sql: string = "select t.column_name ,t.table_name ,t.data_type\n" +
            "from information_schema.columns t\n" +
            "where table_schema = 'bill'\n";
        const rows: any [] = await mysql.query(sql, []);
        for (const row of rows) {
            const tableName = row["table_name"];
            let table: Table | undefined = result.get(tableName);
            if (!table) {
                table = {
                    tableName,
                    columns: [],
                    dateTimeColumns: [],
                };
                result.set(tableName, table);
            }
            table.columns.push(row);
        }
        //处理dateTimeColumns
        for (const table of result.values()) {
            const columns = table.columns;
            table.dateTimeColumns = columns
                .filter((item) => item["data_type"] === "datetime" || item["data_type"] === "date")
                .map((item) => item["column_name"]);
        }
        this.app.mCache.tableStructure = result;
        this.app.loggers.logger.info("[schedule]", "app.cache.tableStructure refresh");
    }

    private async getAllBcTableNames(): Promise<string[]> {
        const sql = "select distinct t.table_name\n" +
            "from information_schema.columns t\n" +
            "where t.table_schema = 'bill'\n" +
            "  and t.table_name like 'bc_%'";
        const {sqlExecutor} = this.app;
        const rows: any[] = await sqlExecutor.query(sql, []);
        const tableNames: string[] = [];
        for (const row of rows) {
            tableNames.push(row["table_name"]);
        }
        return tableNames;
    }

    private async updateForeignKey() {
        const {mysql} = this.app;
        const tableNames: string[] = await this.getAllBcTableNames();
        const cache: Map<string, Map<string, ForeignKeyData>> = new Map<string, Map<string, ForeignKeyData>>();
        for (const tableName of tableNames) {
            const rows = await mysql.select(tableName);
            const foreignName = tableName.substr(3) + "_name";
            const foreignKey = tableName.substr(3) + "_id";
            const map = new Map<string, ForeignKeyData>();
            for (const row of rows) {
                const id = row["id"];
                const name = row["name"];
                map.set(id, {foreignKey, foreignName, foreignValue: name});
            }
            cache.set(foreignKey, map);
        }
        this.app.mCache.bcForeignKey = cache;
        this.app.loggers.logger.info("[schedule]", "app.cache.bcForeignKey refresh");
    }

    private async updateBcCache() {
        const {mysql} = this.app;
        const tableNames: string[] = await this.getAllBcTableNames();
        const cache: Map<string, any[]> = new Map<string, any[]>();
        for (const tableName of tableNames) {
            const rows = await mysql.select(tableName);
            cache.set(tableName, rows);
        }
        this.app.mCache.bcTableCache = cache;
        this.app.loggers.logger.info("[schedule]", "app.cache.bcTableCache refresh");
    }
}