import {Controller,Application,Context} from 'egg';

export default class extends Controller {
    public async list() {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        const {sqlExecutor,tableRowHelper} = app;
        let sql = "select t.*\n" +
            "from bc_card t\n" +
            "order by length(t.name) asc, t.user_id asc";
        let data:any[] = await sqlExecutor.query(sql);
        for (let row of data) {
            await tableRowHelper.translateId(row);
            await tableRowHelper.translateDateTime("bc_card", row);
        }
        ctx.body.data =data;
    }
}
