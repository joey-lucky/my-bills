import {Application, Context, Controller} from "egg";
import Assert from "../../utils/Assert";

export default class Safe extends Controller {
    public async login() {
        const {ctx} = this;
        const params = ctx.request.queryParams;
        const userName = params["userName"];
        const password = params["password"];
        Assert.hasText(userName, "用户名为空");
        Assert.hasText(password, "密码为空");
        const row: any = await ctx.service.table.bcUser.getUserByLoginName(userName);
        Assert.notNull(row, "用户名不存在");
        const loginPassword = row["login_password"];
        Assert.isTrue(password === loginPassword, "密码错误");
        row.token = ctx.app.tokenCrypto.createToken(row.id);
        ctx.body.data = [row];
    }

    public async getUserInfo(){
        const app: Application = this.app;
        const ctx: Context = this.ctx;
        const userInfo = await ctx.getUserInfo();
        ctx.body.data = [userInfo];
    }
}
