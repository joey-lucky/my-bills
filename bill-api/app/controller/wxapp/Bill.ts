import {Application, Context, Controller} from 'egg';
import StringUtils from "../../utils/StringUtils";
import Assert from "../../utils/Assert";

export default class extends Controller {
    //添加账单
    public async create() {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        const {sqlExecutor, tableRowHelper} = app;
        let params = this.ctx.request.queryObjects;
        Assert.notNull(params.data, "数据不能为空");
        let data = params.data;
        let userInfo = await ctx.getUserInfo();
        data["user_id"] = userInfo["id"];
        try {
            await tableRowHelper.completeInsertTableRow(data, ctx);
            await sqlExecutor.insert("bd_bill", data);
            ctx.body.message = "保存成功";
        } catch (e) {
            throw new Error("数据库插入异常");
        }
    }

    //添加账单
    public async update() {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        const {sqlExecutor, tableRowHelper} = app;
        let params = this.ctx.request.queryObjects;
        Assert.notNull(params.data, "数据不能为空");
        let data = params.data;
        let userInfo = await ctx.getUserInfo();
        data["user_id"] = userInfo["id"];
        try {
            await tableRowHelper.completeUpdateTableRow(data, ctx);
            let result = await sqlExecutor.update("bd_bill", data);
            Assert.isTrue(result.affectedRows >= 1, "更新0条记录");
            ctx.body.message = "更新成功"
        } catch (e) {
            throw new Error("数据库插入异常");
        }
    }

    public async list() {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        let params = this.ctx.request.queryObjects;
        let userId = params["user_id"];
        let pageInfo = params["pageInfo"];

        const {sqlExecutor, tableRowHelper} = app;
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
        const queryParams: any[] = [];
        if (StringUtils.hasText(userId)) {
            sql += "  and t.user_id = ?\n";
            queryParams.push(userId);
        }
        sql += "order by t.date_time desc";
        let result = await sqlExecutor.queryPage(sql, queryParams, params.pageInfo);
        for (let row of result.rows) {
            await tableRowHelper.translateId(row);
            await tableRowHelper.translateDateTime("bd_bill", row);
        }
        ctx.body.pageInfo = pageInfo;
        ctx.body.data = result.rows;
    }
}
