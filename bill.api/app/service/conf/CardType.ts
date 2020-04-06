import {BcCardType, PageInfo} from "../../database/index";
import {RestFullService} from "../../typings/rest";
import BaseService from "../BaseService";

export default class CardType extends BaseService implements RestFullService {
    public async create(data: any): Promise<any> {
        const entity: BcCardType = this.parseToEntity(BcCardType, data);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BcCardType, id);
        await this.deleteEntity(BcCardType, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BcCardType, id);
        const entity: BcCardType = this.parseToEntity(BcCardType, data);
        entity.id = id;
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BcCardType, id);
    }

    public async index(params: any): Promise<any[]> {
        return await this.app.dbManager.find(BcCardType);
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        return await this.app.dbManager.findPage(BcCardType,pageInfo);
    }
}
