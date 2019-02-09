import {Controller} from 'egg';
import * as assert from "assert";

export default class extends Controller {
    //添加账单
    public async create() {
        const {app, ctx} = this;
        const {sqlExecutor,tableRowHelper} = app;
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
}
