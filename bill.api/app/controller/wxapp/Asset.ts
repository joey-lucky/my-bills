import {Application, Context, Controller} from "egg";

export default class extends Controller {
    //添加账单
    public async list() {
        const app: Application = this.app;
        const ctx: Context = this.ctx;
        await app.calculateBalance.calculate();
        // language=MySQL
        const sql = "select t.*,\n" +
            "       t1.pic\n" +
            "from bc_card t\n" +
            "       left join bc_user t1 on t1.id = t.user_id\n" +
            "order by t.user_id desc,abs(t.balance) desc";
        const data = await app.sqlExecutor.query(sql, []);
        await app.tableRowHelper.translateIds(data);
        ctx.body.data = data;
    }
}
