import {Application,Context} from 'egg';
import * as moment from "moment";
import * as UUID from "node-uuid";

/**
 * 解析、翻译表数据
 */
export default class TableRowHelper {
    readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public async translateId(row: any): Promise<void> {
        const bcForeignKeyCache: Map<string, Map<string, Object>> = this.app.mCache.get("bcForeignKey");
        let keys = Object.keys(row);
        for (let key of keys) {
            let value = row[key];
            if (bcForeignKeyCache.has(key)) {
                let cache = bcForeignKeyCache.get(key);
                if (cache) {
                    let obj = cache.get(value);
                    Object.assign(row, obj);
                }
            }
        }
    }

    public async translateIds(rows: any[]): Promise<void> {
        for (let row of rows) {
            await this.translateId(row);
        }
    }

    public async translateDateTime(tableName: string, row: any): Promise<void> {
        const tableStructureCache: Map<string, any> = this.app.mCache.get("tableStructure");
        let tableStructure = tableStructureCache.get(tableName);
        for (let columnName of tableStructure.dateTimeColumns) {
            if (row[columnName]) {
                let date: Date = row[columnName];
                row[columnName] = moment(date).format("YYYY-MM-DD HH:mm:ss");
            }
        }
    }

    public async deleteUselessFields(tableName: string, row: any): Promise<void> {
        const tableStructureCache: Map<string, any> = this.app.mCache.get("tableStructure");
        let tableStructure = tableStructureCache.get(tableName);
        let columns = tableStructure.columns;
        let columnsSet = new Set(columns.map((item)=>item["column_name"]));
        let keys:string[] = Object.keys(row);
        for (let key of keys) {
            if (!columnsSet.has(key)) {
                delete row[key];
            }
        }
    }

    public async translateToDate(tableName: string, row: any): Promise<void> {
        const tableStructureCache: Map<string, any> = this.app.mCache.get("tableStructure");
        let tableStructure = tableStructureCache.get(tableName);
        for (let columnName of tableStructure.dateTimeColumns) {
            if (row[columnName]) {
                let date: Date = row[columnName];
                row[columnName] = moment(date).toDate();
            }
        }
    }

    public async translateToDates(tableName: string, rows: any[]): Promise<void> {
        for (let row of rows) {
            await this.translateToDate(tableName,row);
        }
    }

    public async completeInsertTableRow(row, ctx: Context): Promise<void> {
        row.id = row.id || UUID.v1();
        row["create_time"] = new Date();
        row["create_by"] = ctx.userInfo.id;
        return row;
    }

    public async completeUpdateTableRow(row, ctx: Context): Promise<void> {
        row.id = row.id || UUID.v1();
        row["update_time"] = new Date();
        row["update_by"] = ctx.userInfo.id;
        return row;
    }
}
