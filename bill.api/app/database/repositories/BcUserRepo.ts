import {EntityRepository, getRepository, Repository} from "typeorm";
import {BcUser} from "../entity/BcUser";
import Assert from "../../utils/Assert";

@EntityRepository(BcUser)
export default class BcUserRepo extends Repository<BcUser> {
    public async login(userName = "", password = ""): Promise<BcUser> {
        let data: BcUser[] = await getRepository(BcUser).find({where: {loginName: userName, loginPassword: password}});
        Assert.isTrue(data.length > 0, "用户名或密码错误");
        return data[0];
    }
}