import Schedule from "./Schedule";
import DBManager from "../database/DBManager";
import Log from "../utils/Log";
import Table, {Field} from "../database/Table";

export default class TableStructureCache implements Schedule {
    static _instance = new TableStructureCache();

    public static getInstance() {
        return this._instance;
    }

    public static hasTable(tableName: string = ""): boolean {
        return TableStructureCache.getInstance()._tableStructureCache.has(tableName.toLowerCase());
    }

    public static getTableStructure(tableName: string = ""): Table {
        return this.getInstance()._tableStructureCache.get(tableName);

    }

    public static translateTableRows(data: any[]): any[] {
        return TableStructureCache.getInstance()._translateTableRows(data)
    }

    public static translateTablePrimaryAliasName(rows:any[],tableName:string=""){
        if (tableName.startsWith("bc_") || tableName.startsWith("bd_")) {
            let  nameKey = tableName.substr(3)+"_name";
            let idKey = tableName.substr(3)+"_id";
            for (let row of rows) {
                row[nameKey] = row["name"];
                row[idKey] = row["id"];
            }
        }
        return rows;
    }

    //表名-表结构
    _tableStructureCache: Map<string, Table> = new Map();
    //表主键别名-表名
    _foreignKeyAliasCache: Map<string, string> = new Map();
    //表数据
    _tableEntriesCache: Map<string, any[]> = new Map();
    //<表名，<主键key，主键name>>
    _tablePrimaryKeyNameCache: Map<string, Map<string, string>> = new Map();

    public run = async () => {
        Log.info("表结构缓存初始化...");
        let start = Date.now();
        await this._generateTableStructure();
        await this._generateTableEntries();
        let end = Date.now();
        Log.info("表结构缓存初始化完成", "耗时:" + (end - start) + "ms")
    };

    private _translateTableRows(data: any[]) {
        if (data.length > 0) {
            let firstRow = data[0];
            //需要翻译的字段列表
            let foreignKeys = Object.keys(firstRow)
                .filter((item) => this._foreignKeyAliasCache.has(item));
            //获取需要翻译的数据列表
            foreignKeys.forEach((foreignKey) => {
                let tableName = this._foreignKeyAliasCache.get(foreignKey);
                let tableStructure = this._tableStructureCache.get(tableName);
                let {primaryNameAliasName} = tableStructure;
                let primaryKeyNames: Map<string, string> = this._tablePrimaryKeyNameCache.get(tableName);
                data.forEach((item) => {
                    let id = item[foreignKey];
                    item[primaryNameAliasName] = primaryKeyNames.get(id);
                })
            });
        }
        return data;
    }

    private async _generateTableStructure() {
        //获取纯净的表名，去除BC或者BD等字样
        function getPureTableName(tableName: string) {
            let lowerCaseTableName = tableName.toLowerCase();
            if (lowerCaseTableName.startsWith("bc_") || lowerCaseTableName.startsWith("bd_")) {
                //删除开头bc_
                return tableName.substr(3);
            }
            throw new Error("表名异常");
        }

        // language=MySQL
        let sql = "select t.table_name,\n" +
            "       t.column_name,\n" +
            "       t.column_key,\n" +
            "       t.data_type\n" +
            "from information_schema.columns t\n" +
            "where table_schema = 'bill'";
        let data = await DBManager.query(sql, []);
        let tableStructureMap: Map<string, Table> = new Map();
        let primaryKeyAliasMap: Map<string, string> = new Map();

        data.forEach((item) => {
            let tableName = item["table_name"];
            let columnName = item["column_name"];
            let columnKey = item["column_key"];
            let dataType = item["data_type"];
            // 默认ID为主键
            // let isPrimary = columnKey === "PRI";
            let isPrimary = columnName === "id";
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
                isPrimary:isPrimary,
                dataType:dataType,
            };
            fields.push(field);
            if (isPrimary) {
                table.primaryKeyAliasName = getPureTableName(tableName)+"_id";
                table.primaryNameAliasName = getPureTableName(tableName)+"_name";
            }
        });
        for (let table of tableStructureMap.values()) {
            if (table.primaryKeyAliasName) {
                primaryKeyAliasMap.set(table.primaryKeyAliasName, table.tableName);
            }
        }
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

    private async _generateTableEntries() {
        // language=MySQL
        let sql = 'select t.table_name\n' +
            "from information_schema.tables t\n" +
            "where t.table_schema = 'bill'\n" +
            "  and t.table_name like 'bc_%'";
        let tableNameList = await DBManager.query(sql, null);
        let tableEntriesCache: Map<string, any[]> = new Map();
        for(let item of tableNameList){
            let tableName = item["table_name"];
            // language=MySQL
            let sql = `select t.* from ${tableName} t`;
            let tableNameList = await DBManager.query(sql);
            tableEntriesCache.set(tableName, tableNameList || []);
        }
        let tablePrimaryKeyNameCache: Map<string, Map<string, string>> = new Map();
        for (let tableName of tableEntriesCache.keys()) {
            let map = new Map<string, string>();
            let tables: any = tableEntriesCache.get(tableName);
            for (let table of tables) {
                map.set(table.id, table.name);
            }
            tablePrimaryKeyNameCache.set(tableName, map);
        }
        this._tablePrimaryKeyNameCache = tablePrimaryKeyNameCache;
        this._tableEntriesCache = tableEntriesCache;
    }
}
