import {Controller,Application,Context} from 'egg';
import Assert from "../../utils/Assert";

export default class Safe extends Controller {
    public async login() {
        const {ctx} = this;
        let params = ctx.request.queryParams;
        let userName = params["userName"];
        let password = params["password"];
        Assert.hasText(userName, "用户名为空");
        Assert.hasText(password, "密码为空");
        let row:any = await ctx.service.table.bcUser.getUserByLoginName(userName);
        Assert.notNull(row, "用户名不存在");
        let loginPassword = row["login_password"];
        Assert.isTrue(password === loginPassword, "密码错误");
        row.token = ctx.app.tokenCrypto.createToken(row.id);
        ctx.body.data = [row];
    }

    public async getUserInfo(){
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        let userInfo = await ctx.getUserInfo();
        ctx.body.data = [userInfo];
    }
}
