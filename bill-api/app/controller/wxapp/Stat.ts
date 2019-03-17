import {Application, Context, Controller} from 'egg';
import Assert from "../../utils/Assert";
import moment = require("moment");

export default class Stat extends Controller {
    //添加账单
    public async getStatGroupByMonth() {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        // language=MySQL
        let sql = "select DATE_FORMAT(t.date_time, '%Y%m') as datetime,\n" +
            "       sum(t.money)                     as money\n" +
            "from bd_bill t\n" +
            "       left join bc_bill_type t1 on t1.id = t.bill_type_id\n" +
            "where t1.type in ('1', '-1')\n" +
            "group by DATE_FORMAT(t.date_time, '%Y%m'), t.money >= 0\n" +
            "order by DATE_FORMAT(t.date_time, '%Y%m') desc";
        let rows = await app.sqlExecutor.query(sql, []);
        for (let row of rows) {
            let datetime = row.datetime;
            row.datetime = moment(datetime, "YYYYMM").format("YYYY-MM-DD HH:mm:ss");
        }
        ctx.body.data = rows;
    }

    //添加账单
    public async getMonthStatDetail() {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        let datetime = ctx.request.queryParams.datetime;
        Assert.hasText(datetime,"日期不能为空");
        datetime = moment(datetime).format("YYYYMM");
        // language=MySQL
        let sql = "select t.user_id,\n" +
            "       t.bill_type_id,\n" +
            "       max(t1.pic)  as pic,\n" +
            "       sum(t.money) as money\n" +
            "from bd_bill t\n" +
            "       left join bc_user t1 on t1.id = t.user_id\n" +
            "       left join bc_bill_type t2 on t2.id = t.bill_type_id\n" +
            "where t2.type in ('1', '-1')\n" +
            "  and DATE_FORMAT(t.date_time, '%Y%m') = ?\n" +
            "group by t.money >= 0, t.bill_type_id, t.user_id\n" +
            "order by abs(sum(t.money)) desc";
        let rows = await app.sqlExecutor.query(sql, [datetime]);
        for (let row of rows) {
            await app.tableRowHelper.translateId(row);
        }
        ctx.body.data = rows;
    }
}
