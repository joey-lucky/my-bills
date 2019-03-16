import {Application, Context, Controller} from 'egg';
import Assert from "../../utils/Assert";
import StringUtils from "../../utils/StringUtils";

export default class BillList extends Controller {
    /**
     * 获取分页账单信息
     */
    public async getBillPageData() {
        let ctx = this.ctx;
        let app: Application = this.app;
        let params = this.ctx.request.queryObjects;
        let userId = params["user_id"];
        let pageInfo = params["pageInfo"];
        Assert.notNull(pageInfo, "page info is null");
        // language=MySQL
        let sql = "select t.*,\n" +
            "       t1.pic,\n" +
            "       t3.name       as cardUserName,\n" +
            "       case\n" +
            "         when to_days(t.date_time) = to_days(now()) then \'今天\'\n" +
            "         when to_days(t.date_time) = to_days(now()) - 1 then \'昨天\'\n" +
            "         when yearweek(t.date_time) = yearweek(now()) then \'本周\'\n" +
            "         when DATE_FORMAT(t.date_time, \'%Y%m\') = DATE_FORMAT(now(), \'%Y%m\') then \'本月\'\n" +
            "         else date_format(t.date_time, \'%Y年%m月\') end as timeDesc\n" +
            "from bd_bill t\n" +
            "       left join bc_user t1 on t1.id = t.user_id\n" +
            "       left join bc_card t2 on t2.id = t.card_id\n" +
            "       left join bc_user t3 on t3.id = t2.user_id\n" +
            "where 1 = 1\n";
        let queryParams: any[] = [];
        if (StringUtils.hasText(userId)) {
            sql += "  and t.user_id = ?\n";
            queryParams.push(userId);
        }
        sql += "order by t.date_time desc";
        let result = await app.sqlExecutor.queryPage(sql, queryParams, params.pageInfo);
        for (let row of result.rows) {
            await app.tableRowHelper.translateId(row);
            await app.tableRowHelper.translateDateTime("bd_bill", row);
        }
        ctx.body.data=result.rows;
        ctx.body.pageInfo = result.pageInfo;
    }

    public async getUserInfo(){
        let ctx = this.ctx;
        let userInfo =await ctx.getUserInfo();
        ctx.body.data = [userInfo]
    }
}
