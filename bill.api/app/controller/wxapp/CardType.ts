import {Application, Context, Controller} from "egg";

export default class extends Controller {
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
}
