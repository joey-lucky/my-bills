import {Application, Service} from "egg";
import SqlStringUtils from "../../utils/SqlStringUtils";

export default class extends Service {
    public async getList(type?: string[]): Promise<any[]> {
        const app: Application = this.app;
        let sql = "select t.*\n" +
            "from bc_bill_type t\n" +
            "where 1 = 1\n";
        const queryParams: string[] = [];
        if (type && type.length > 0) {
            const markSql = SqlStringUtils.getNumOfQuestionMark(type.length);
            sql += `  and t.type in (${markSql})\n`;
            queryParams.push(...type);
        }
        sql += "order by t.sort desc\n";
        const rows = await app.sqlExecutor.query(sql, queryParams);
        await app.tableRowHelper.translateId(rows);
        return rows;
    }
}
