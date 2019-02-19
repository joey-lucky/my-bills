import {Controller} from 'egg';
import * as assert from "assert";

export default class extends Controller {
    //添加账单
    public async create() {
        const {app, ctx} = this;
        const {sqlExecutor, tableRowHelper} = app;
        const params = ctx.query;

        assert.ok(params["data"], "数据不能为空");
        let data = JSON.parse(params["data"] || "{}");
        data["user_id"] = ctx.userInfo["id"];
        try {
            await tableRowHelper.completeInsertTableRow(data, ctx);
            await sqlExecutor.insert("bd_bill", data);
            ctx.body = "保存成功";
        } catch (e) {
            throw new Error("数据库插入异常");
        }
    }

    //添加账单
    public async update() {
        const {app, ctx} = this;
        const {sqlExecutor, tableRowHelper} = app;
        const params = ctx.query;

        assert.ok(params["data"], "数据不能为空");
        let data = JSON.parse(params["data"] || "{}");
        data["user_id"] = ctx.userInfo["id"];
        try {
            await tableRowHelper.completeUpdateTableRow(data, ctx);
            let result = await sqlExecutor.update("bd_bill", data);
            assert.ok(result.affectedRows >= 1, "更新0条记录");
            ctx.body = "更新成功";
        } catch (e) {
            throw new Error("数据库插入异常");
        }
    }

    public async list() {
        const {app, ctx} = this;
        const {sqlExecutor, tableRowHelper} = app;
        // language=MySQL
        let sql = "select t.*,\n" +
            "       t1.pic,\n" +
            "       case\n" +
            "              when to_days(t.date_time) = to_days(now()) then '今天'\n" +
            "              when to_days(t.date_time) = to_days(now()) - 1 then '昨天'\n" +
            "              when yearweek(t.date_time) = yearweek(now()) then '本周'\n" +
            "              when DATE_FORMAT(t.date_time, '%Y%m') = DATE_FORMAT(now(), '%Y%m') then '本月'\n" +
            "              else '' end as timeDesc\n" +
            "from bd_bill t\n" +
            "            left join bc_user t1 on t1.id = t.user_id\n" +
            "order by t.date_time desc";
        let data: any[] = await sqlExecutor.query(sql);
        for (let row of data) {
            await tableRowHelper.translateId(row);
            await tableRowHelper.translateDateTime("bd_bill", row);
        }
        ctx.body = data;
    }
}
