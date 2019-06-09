import {EntityRepository, getRepository} from "typeorm";
import BaseRepository from "../BaseRepository";
import {BcUser} from "../entity/BcUser";
import Assert from "../../utils/Assert";

@EntityRepository(BcUser)
export default class BcUserRepo extends BaseRepository<BcUser> {
    async login(userName = "", password = ""): Promise<BcUser> {
        let data: BcUser[] = await getRepository(BcUser).find({where: {loginName: userName,loginPassword:password}});
        Assert.isTrue(data.length > 0, "用户名或密码错误");
        return data[0];
    }

    async findUserName(userId: string): Promise<string> {
        let user = await this.findOne(userId, {cache: 60 * 60 * 1000});
        return user && user.name || "";
    }
}