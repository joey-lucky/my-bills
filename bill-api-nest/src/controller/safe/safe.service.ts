import {BcUser} from "../../database";
import {Assert} from "../../utils/Assert";
import {BaseService} from "../base.service";

export  class SafeService extends BaseService {
    public async login(userName:string,password:string) {
        type LoginEntity = { token?: string } & BcUser;
        Assert.hasText(userName, "用户名为空");
        Assert.hasText(password, "密码为空");
        const data: BcUser[] = await this.dbService.find(BcUser, {where: {loginName: userName, loginPassword: password}});
        Assert.notEmpty(data, "用户名或密码错误");
        const entity: LoginEntity = data[0];
        return entity;
    }
}