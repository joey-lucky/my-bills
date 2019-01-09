import {Service} from 'egg';
import * as assert from "assert";

export default class extends Service {
    public async login(params) {
        const {app,ctx} = this;
        let userName = params["userName"];
        let password = params["password"];
        assert.ok(userName, "用户名不能为空");
        assert.ok(password, "密码不能为空");
        let row = await app.mysql.get("bc_user",{login_name:userName});
        assert.ok(row, "用户名不存在");
        assert.ok(row["login_password"] === password, "密码错误");
        return row;
    }
}

