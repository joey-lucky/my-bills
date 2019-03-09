import {Application, Context, Controller} from 'egg';

export default class extends Controller {
    //添加账单
    public async list() {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        let params = ctx.request.queryParams;
        const {sqlExecutor,tableRowHelper} = app;
        // language=MySQL
        const sql = "select t.*,\n" +
            "       IFNULL(t1.totalMoney,0) totalMoney,\n" +
            "       t2.pic\n" +
            "from bc_card t\n" +
            "       left join (select it1.card_id, sum(it1.money) as totalMoney from bd_bill it1 group by it1.card_id) t1\n" +
            "         on t1.card_id = t.id\n" +
            "       left join bc_user t2 on t2.id = t.user_id\n" +
            "order by length(t.name) asc, t.user_id asc";
        let data = await sqlExecutor.query(sql,[]);
        await tableRowHelper.translateIds(data);
        ctx.body.data = data;
    }
}
