import {BcBillType} from "../../database/index";
import {RestFullService} from "../../typings/rest";
import BaseService from "../BaseService";

export default class BillType extends BaseService implements RestFullService {
    public async create(data: any): Promise<any> {
        const entity: BcBillType = this.parseToEntity(BcBillType, data);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BcBillType, id);
        await this.deleteEntity(BcBillType, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BcBillType, id);
        const entity: BcBillType = this.parseToEntity(BcBillType, data);
        entity.id = id;
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BcBillType, id);
    }

    public async index(params: any): Promise<any[]> {
        return await this.app.dbManager.find(BcBillType);
    }
}
