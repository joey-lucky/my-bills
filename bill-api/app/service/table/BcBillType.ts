import {Application, Service} from 'egg';

export default class extends Service {
    public async getList(params = {}): Promise<any[]> {
        let app: Application = this.app;
        let sql = "select t.*\n" +
            "from bc_bill_type t\n" +
            "order by t.sort desc ";
        let rows = await app.sqlExecutor.query(sql, []);
        await app.tableRowHelper.translateId(rows);
        return rows;
    }
}
