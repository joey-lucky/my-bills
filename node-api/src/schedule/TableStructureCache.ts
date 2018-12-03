import Schedule from "./Schedule";
import DBManager from "../database/DBManager";
import Log from "../utils/Log";

interface Table {
    tableName: string;
    primaryKeyAliasName?: string;
    fields: Field[];
    foreignKeys: string[];
}

interface Field {
    name: string;
    isPrimary: boolean;
}

export default class TableStructureCache implements Schedule {
    static _instance = new TableStructureCache();

    static getInstance() {
        return this._instance;
    }

    _tableStructureCache: Map<string, Table> = new Map();

    _foreignKeyAliasCache: Map<string, string> = new Map();

    public run = async () => {
        Log.info("表结构缓存初始化...");
        let start = Date.now();
        await this._generateTableStructure();
        let end = Date.now();
        Log.info("表结构缓存初始化完成", "耗时:" + (end - start) + "ms")
    };

    public hasTable(tableName: string = ""): boolean {
        return this._tableStructureCache.has(tableName.toLowerCase());
    }

    public hasForeignKey(foreignKey: string = ""): boolean {
        return this._foreignKeyAliasCache.has(foreignKey.toLowerCase());
    }

    public getTableStructure(tableName: string=""): Table | undefined {
        return this._tableStructureCache.get(tableName.toLowerCase());
    }

    public getFields(tableName: string=""): Field[] {
        let table = this.getTableStructure(tableName.toLowerCase());
        if (table) {
            return table.fields || [];
        } else {
            return [];
        }
    }

    public getTableNameByForeignKey(foreignKey: string=""): string {
        return this._foreignKeyAliasCache.get(foreignKey.toLowerCase()) || undefined;
    }

    private async _generateTableStructure() {
        let sql = "select t.table_name,t.column_name,t.column_key from information_schema.columns t where table_schema = 'bill'";
        let data = await DBManager.query(sql, []);
        let tableStructureMap: Map<string, Table> = new Map();
        let primaryKeyAliasMap: Map<string, string> = new Map();

        data.forEach((item) => {
            let tableName = item["table_name"];
            let columnName = item["column_name"];
            let columnKey = item["column_key"];
            let isPrimary = columnKey === "PRI";
            if (!tableStructureMap.has(tableName)) {
                tableStructureMap.set(tableName, {
                    tableName: tableName,
                    fields: [],
                    foreignKeys: []
                });
            }
            let table = tableStructureMap.get(tableName);
            let {fields} = table;
            let field: Field = {
                name: columnName,
                isPrimary: isPrimary
            };
            fields.push(field);
            if (isPrimary) {
                table.primaryKeyAliasName = this.getPrimaryKeyAliasName(tableName, columnName);
            }
        });
        Object.values(tableStructureMap)
            .forEach((item: Table) => {
                if (item.primaryKeyAliasName) {
                    primaryKeyAliasMap.set(item.primaryKeyAliasName, item.tableName);
                }
            });

        for (let table of tableStructureMap.values()) {
            let foreignKeys = [];
            table.fields.forEach((field) => {
                if (primaryKeyAliasMap.has(field.name)) {
                    foreignKeys.push(field.name);
                }
            });
            table.foreignKeys = foreignKeys;
        }
        this._tableStructureCache = tableStructureMap;
        this._foreignKeyAliasCache = primaryKeyAliasMap;
    }

    private getPrimaryKeyAliasName(tableName: string, primaryKey: string) {
        let upperCaseTableName = tableName.toLowerCase();
        if (upperCaseTableName.startsWith("bc_") || upperCaseTableName.startsWith("bd_")) {
            //删除开头bc_
            let needTableName = tableName.substr(4);
            //再将_去掉，并且首字母大写
            return needTableName + "_" + primaryKey;
        }
        return primaryKey;
    }
}