import {Application, Service} from "egg";

export default class extends Service {

    public async getListByCardTypeId(cardTypeId?: string|string[]): Promise<any[]> {
        const app: Application = this.app;
        let sql = "select *\n" +
            "from bc_card t\n" +
            "where 1=1\n";
        const queryParams: string[] = [];
        if (cardTypeId) {
            if (typeof cardTypeId === "string") {
                sql += "  and t.card_type_id = ?\n";
                queryParams.push(cardTypeId);
            }else if (Array.isArray(cardTypeId) && cardTypeId.length > 0) {
                let idSql = "";
                for (const id of cardTypeId) {
                    idSql += "?,";
                    queryParams.push(id);
                }
                idSql = idSql.substr(0, idSql.length - 1);
                sql += `  and t.card_type_id in (${idSql})\n`;
            }
        }
        sql += "order by t.user_id asc,t.card_type_id asc,t.name asc";
        const rows: any[] = await app.sqlExecutor.query(sql, queryParams);
        for (const row of rows) {
            await app.tableRowHelper.translateId(row);
        }
        return rows;
    }

    public async getList(): Promise<any[]> {
        const app: Application = this.app;
        let sql = "select *\n" +
            "from bc_card t\n" +
            "where 1=1\n";
        const queryParams: string[] = [];
        sql += "order by t.user_id asc,t.card_type_id asc,t.name asc";
        const rows: any[] = await app.sqlExecutor.query(sql, queryParams);
        for (const row of rows) {
            await app.tableRowHelper.translateId(row);
        }
        return rows;
    }
}
