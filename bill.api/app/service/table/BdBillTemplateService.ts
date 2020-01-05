import {BaseService} from "../BaseService";
import {BdBillTemplate, find} from "../../database";
import {DeepPartial} from "typeorm";

export default class BdBillTemplateService extends BaseService {
    findByCtxUser(): Promise<BdBillTemplate[]> {
        return find(BdBillTemplate, {where: {userId: this.getCtxUserId()}});
    }

    async create() {
        let data: DeepPartial<BdBillTemplate> = this.getRequestTableFirstData("data");
        data.userId = this.getCtxUserId();
        let entity:BdBillTemplate = this.parseToEntity(BdBillTemplate, data);
        await this.createEntity(entity);
    }

    async update() {
        let data: DeepPartial<BdBillTemplate> = this.getRequestTableFirstData("data");
        data.userId = this.getCtxUserId();
        let entity:BdBillTemplate = this.parseToEntity(BdBillTemplate, data);
        await this.updateEntity(entity);
    }
}