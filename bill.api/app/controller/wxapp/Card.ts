import {Application, Context, Controller} from "egg";

export default class BillList extends Controller {
    public async list() {
        const app: Application = this.app;
        const ctx: Context = this.ctx;
        const {sqlExecutor, tableRowHelper} = app;
        const sql = "select t.*\n" +
            "from bc_card t\n" +
            "order by length(t.name) asc, t.user_id asc";
        const data: any[] = await sqlExecutor.query(sql);
        for (const row of data) {
            await tableRowHelper.translateId(row);
            await tableRowHelper.translateDateTime("bc_card", row);
        }
        ctx.body.data = data;
    }

    public async listGroupByUser() {
        const app: Application = this.app;
        const ctx: Context = this.ctx;
        const {sqlExecutor, tableRowHelper} = app;
        const sql = "select t.*\n" +
            "from bc_card t\n" +
            "order by length(t.name) asc, t.user_id asc";
        const data: any[] = await sqlExecutor.query(sql);
        for (const row of data) {
            await tableRowHelper.translateId(row);
            await tableRowHelper.translateDateTime("bc_card", row);
        }
        //分组
        const map: Map<string, any[]> = new Map<string, any[]>();
        for (const row of data) {
            const userId = row["user_id"];
            let arrays = map.get(userId);
            if (!arrays) {
                arrays = [];
                map.set(userId, arrays);
            }
            arrays.push(row);
        }
        const result: any[] = [];
        for (const key of map.keys()) {
            const value: any = map.get(key);
            const firstValue = value[0];
            result.push({
                id: key,
                name: firstValue["user_name"],
                children: value,
            });
        }
        ctx.body.data = result;
    }
}
