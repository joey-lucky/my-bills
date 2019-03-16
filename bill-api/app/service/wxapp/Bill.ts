import {Service,Application} from 'egg';
import Assert from "../../utils/Assert";
import StringUtils from "../../utils/StringUtils";
import {Context} from "egg";

export default class extends Service {
    //添加账单
    public async createBill():Promise<void> {
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


}
