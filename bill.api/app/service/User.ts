import {BaseService} from "./BaseService";
import {RestFullService} from "../typings/rest";
import {BcUser, find, findOne} from "../database";
import Assert from "../utils/Assert";

export default abstract class User extends BaseService implements RestFullService {
    public async destroy(id: string): Promise<any> {
        let entity = await findOne(BcUser, id);
        Assert.isTrue(!!entity, "id not exist");
        await this.deleteEntity(BcUser, id);
    }

    public async index(params: any): Promise<any[]> {
        return await find(BcUser);
    }

    public async show(id: string): Promise<any> {
        return await findOne(BcUser, id);
    }

    public async create(data: any): Promise<any> {
        let entity: BcUser[] = this.parseToEntities(BcUser, data);
    }

    public async update(id: string, data): Promise<any> {
        return undefined;
    }
}
