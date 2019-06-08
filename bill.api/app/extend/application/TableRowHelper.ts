import {Application, Context} from "egg";
import * as moment from "moment";
import * as UUID from "node-uuid";
import Table from "../../typings/Table";
import TranslateConfig from "../../typings/TranslateConfig";

export default class TableRowHelper {
    readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public async translateId(row: any, externalTranslateConfig?: TranslateConfig[]): Promise<void> {
        const bcForeignKeyCache = this.app.mCache.bcForeignKey;
        for (const key of Object.keys(row)) {
            const id = row[key];
            const cache = bcForeignKeyCache.get(key);
            if (cache) {
                const foreignKeyData = cache.get(id);
                if (foreignKeyData) {
                    Object.assign(row, {[foreignKeyData.foreignName]: foreignKeyData.foreignValue});
                }
            }
        }
        if (externalTranslateConfig) {
            for (const translateConfig of externalTranslateConfig) {
                const {foreignKey, foreignName, aliasForeignKeyAlias} = translateConfig;
                const id = row[foreignKey];
                const cache = bcForeignKeyCache.get(aliasForeignKeyAlias);
                if (cache) {
                    const foreignKeyData = cache.get(id);
                    if (foreignKeyData) {
                        Object.assign(row, {
                            [foreignName]: foreignKeyData.foreignValue,
                        });
                    }
                }
            }
        }

    }

    public async translateIds(rows: any[]): Promise<void> {
        for (const row of rows) {
            await this.translateId(row);
        }
    }

    public async translateDateTime(tableName: string, row: any): Promise<void> {
        const tableStructureCache: Map<string, Table> = this.app.mCache.tableStructure;
        const tableStructure = tableStructureCache.get(tableName);
        if (tableStructure) {
            for (const columnName of tableStructure.dateTimeColumns) {
                if (row[columnName]) {
                    const date: Date = row[columnName];
                    row[columnName] = moment(date).format("YYYY-MM-DD HH:mm:ss");
                }
            }
        }
    }

    public async deleteUselessFields(tableName: string, row: any): Promise<void> {
        const tableStructureCache: Map<string, Table> = this.app.mCache.tableStructure;
        const tableStructure = tableStructureCache && tableStructureCache.get(tableName);
        const columns = tableStructure && tableStructure.columns;
        if (columns) {
            const columnsSet = new Set(columns.map((item) => item["column_name"]));
            const keys: string[] = Object.keys(row);
            for (const key of keys) {
                if (!columnsSet.has(key)) {
                    delete row[key];
                }
            }
        }

    }

    public async translateToDate(tableName: string, row: any): Promise<void> {
        const tableStructureCache: Map<string, Table> = this.app.mCache.tableStructure;
        const tableStructure = tableStructureCache.get(tableName);
        const dateTimeColumns = tableStructure && tableStructure.dateTimeColumns;
        if (dateTimeColumns){
            for (const columnName of dateTimeColumns) {
                if (row[columnName]) {
                    const date: Date = row[columnName];
                    row[columnName] = moment(date).toDate();
                }
            }
        }
    }

    public async translateToDates(tableName: string, rows: any[]): Promise<void> {
        for (const row of rows) {
            await this.translateToDate(tableName, row);
        }
    }

    public async completeInsertTableRow(row, ctx: Context): Promise<void> {
        const userId = (await ctx.getUserInfo()).id;
        row.id = row.id || UUID.v1();
        row["create_time"] = new Date();
        row["create_by"] = userId;
        return row;
    }

    public async completeUpdateTableRow(row, ctx: Context): Promise<void> {
        const userId = (await ctx.getUserInfo()).id;
        row.id = row.id || UUID.v1();
        row["update_time"] = new Date();
        row["update_by"] = userId;
        return row;
    }
};
