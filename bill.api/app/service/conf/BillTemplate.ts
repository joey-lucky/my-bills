import {BcBillTemplate, BcBillTemplateView, BcBillType, PageInfo} from "../../database";
import {RestFullService} from "../../typings/rest";
import BaseService from "../BaseService";
import {FindConditions, In, Like} from "typeorm";

export default class BillTemplate extends BaseService implements RestFullService {
    public async create(data: any): Promise<any> {
        const entity:BcBillTemplate = this.parseToEntity(BcBillTemplate, data);
        entity.userId = this.getCtxUserId();
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BcBillTemplate, id);
        await this.deleteEntity(BcBillTemplate, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BcBillTemplate, id);
        let entity:BcBillTemplate = this.parseToEntity(BcBillTemplate, data);
        entity.id = id;
        entity.userId = this.getCtxUserId();
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BcBillTemplate, id);
    }

    public async index(params: any): Promise<any[]> {
        const {dbManager} = this.app;
        const where = await this.toFindConditions(params);
        return await dbManager.find(BcBillTemplate, {where});
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        const {dbManager} = this.app;
        const where = await this.toFindConditions(params);
        return await dbManager.findPage(BcBillTemplate, pageInfo,{where});
    }

    private async toFindConditions(params = this.getQueryObjects()): Promise<FindConditions<BcBillTemplateView> | Array<FindConditions<BcBillTemplateView>>> {
        const {dbManager} = this.app;
        const where: FindConditions<BcBillTemplate> = {};
        if (params.id) {
            where.id = params.id;
        }
        if (params.userId) {
            where.userId = params.userId;
        }
        if (params.billTypeId) {
            where.billTypeId = params.billTypeId;
        }
        if (params.targetCardId) {
            where.targetCardId = params.targetCardId;
        }
        if (params.billTypeType) {
            const billTypeList = await dbManager.find(BcBillType, {where: {type: params.billTypeType}});
            const billTypeIdList: string[] = billTypeList.map((item) => item.id);
            where.billTypeId = In(billTypeIdList);
        }
        if (params.billDesc) {
            where.billDesc = Like(`%${params.billDesc}%`);
        }
        if (params.cardId) {
            return [
                {
                    ...where,
                    cardId: params.cardId,
                },
                {
                    ...where,
                    targetCardId: params.cardId,
                },
            ];
        }
        return where;

    }
}
