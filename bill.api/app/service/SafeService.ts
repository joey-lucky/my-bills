import {BcUser} from "../database";
import Assert from "../utils/Assert";
import BaseService from "./BaseService";

export default class SafeService extends BaseService {
    public async login() {
        const {database} = this.app;
        type LoginEntity = { token?: string } & BcUser;
        const userName = this.getString("userName");
        const password = this.getString("password");
        Assert.hasText(userName, "用户名为空");
        Assert.hasText(password, "密码为空");
        const data: BcUser[] = await database.find(BcUser, {where: {loginName: userName, loginPassword: password}});
        Assert.notEmpty(data, "用户名或密码错误");
        const entity: LoginEntity = data[0];
        return entity;
    }
}