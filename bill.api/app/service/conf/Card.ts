import {BcCard, BcCardView, PageInfo} from "../../database/index";
import {RestFullService} from "../../typings/rest";
import BaseService from "../BaseService";

export default class Card extends BaseService implements RestFullService {
    public async create(data: any): Promise<any> {
        const entity: BcCard = this.parseToEntity(BcCard, data);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BcCard, id);
        await this.deleteEntity(BcCard, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BcCard, id);
        const entity: BcCard = this.parseToEntity(BcCard, data);
        entity.id = id;
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BcCard, id);
    }

    public async index(params: any): Promise<any[]> {
        return await this.app.dbManager.find(BcCardView);
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        return await this.app.dbManager.findPage(BcCardView,pageInfo);
    }
}
