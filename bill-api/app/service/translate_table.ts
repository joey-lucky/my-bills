import {Service} from 'egg';


class TableTranslator {
    readonly foreignId: string;
    readonly foreignName: string;
    private tableCache = {};

    constructor(tableName: string, rows: any[]) {
        this.foreignId = tableName.substr(3) + "_id";
        this.foreignName = tableName.substr(3) + "_name";
        rows.forEach((row) => {
            this.tableCache[row["id"]] = row["name"];
        });
    }

    public translate(rows: any[]):void{
        rows.forEach((row) => {
            let id = row[this.foreignId];
            if (id) {
                row[this.foreignName] = this.tableCache[id];
            }
        })
    }
}

export default class extends Service {
    public async translate(rows: any[] = [], foreignKeys: string[]) {
        if (rows.length !== 0) {
            let translators = await this.getTableTranslators(rows[0]);
            for(let translator of translators){
                translator.translate(rows);
            }
        }
    }

    private async getTableTranslators(row):Promise<TableTranslator[]> {
        let allBcTables = await this.getAllBcTableNames();
        let translatorTableNames = Object.keys(row)
            .filter((key: string) => key.endsWith("_id"))
            .map((key: string) => "bc_" + key.substr(0, key.length - 3))
            .filter(tableName => allBcTables.indexOf(tableName) !== -1);
        let translators: TableTranslator[] = [];
        for(let tableName of translatorTableNames){
            let rows = await this.app.mysql.select(tableName);
            translators.push(new TableTranslator(tableName, rows));
        }
        return translators;
    }

    private async getAllBcTableNames(): Promise<string[]> {
        let sql = "select distinct t.table_name\n" +
            "from information_schema.columns t\n" +
            "where table_schema = 'bill'";
        let data = await this.app.mysql.query(sql, []);
        return data.map((row) => row["table_name"]).filter((tableName: string) => tableName.startsWith("bc_"));
    }
}

