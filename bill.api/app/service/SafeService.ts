import {BaseService} from "./BaseService";
import {BcUser, find} from "../database";
import EncryptUtils from "../utils/EncryptUtils";
import Assert from "../utils/Assert";

export default class SafeService extends BaseService {
    public async login() {
        type LoginEntity = { token?: string } & BcUser;
        const userName = this.getString("userName");
        const password = this.getString("password");
        Assert.hasText(userName, "用户名为空");
        Assert.hasText(password, "密码为空");
        let data: BcUser[] = await find(BcUser, {where: {loginName: userName, loginPassword: password}});
        Assert.notEmpty(data, "用户名或密码错误");
        let entity:LoginEntity = data[0];
        entity.token = EncryptUtils.generateToken(entity.id);
        return [entity];
    }
}