import {BcUser, PageInfo} from "../../database/index";
import {RestFullService} from "../../typings/rest";
import BaseService from "../BaseService";

export default class User extends BaseService implements RestFullService {
    public async create(data: any): Promise<any> {
        const entity: BcUser = this.parseToEntity(BcUser, data);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BcUser, id);
        await this.deleteEntity(BcUser, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BcUser, id);
        const entity: BcUser = this.parseToEntity(BcUser, data);
        entity.id = id;
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BcUser, id);
    }

    public async index(params: any): Promise<any[]> {
        return await this.app.database.find(BcUser);
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        return await this.app.database.findPage(BcUser,pageInfo);
    }
}
