import {DeepPartial} from "typeorm";
import {BdBillTemplate, find} from "../../database";
import {BaseService} from "../BaseService";

export default class BdBillTemplateService extends BaseService {
    findByCtxUser(): Promise<BdBillTemplate[]> {
        return find(BdBillTemplate, {where: {userId: this.getCtxUserId()}});
    }

    async create() {
        const data: DeepPartial<BdBillTemplate> = this.getRequestTableFirstData("data");
        data.userId = this.getCtxUserId();
        const entity: BdBillTemplate = this.parseToEntity(BdBillTemplate, data);
        await this.createEntity(entity);
    }

    async update() {
        const data: DeepPartial<BdBillTemplate> = this.getRequestTableFirstData("data");
        data.userId = this.getCtxUserId();
        const entity: BdBillTemplate = this.parseToEntity(BdBillTemplate, data);
        await this.updateEntity(entity);
    }
}