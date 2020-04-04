import {BcBillType, BdBill, BdBillView} from "../../database";
import {RestFullService} from "../../typings/rest";
import BaseService from "../BaseService";
import {Between, FindConditions, In, Like} from "typeorm";
import moment = require("moment");

export default class Bill extends BaseService implements RestFullService {
    public async create(data: any): Promise<any> {
        const entity:BdBill = this.parseToEntity(BdBill, data);
        entity.userId = this.getCtxUserId();
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BdBill, id);
        await this.deleteEntity(BdBill, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BdBill, id);
        let entity:BdBill = this.parseToEntity(BdBill, data);
        entity.id = id;
        entity.userId = this.getCtxUserId();
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BdBill, id);
    }

    public async index(params: any): Promise<any[]> {
        const {dbManager} = this.app;
        const where = await this.toFindConditions(params);
        return await dbManager.find(BdBill, {where, order: {dateTime: "DESC"}});
    }

    private async toFindConditions(params = this.getQueryObjects()): Promise<FindConditions<BdBillView> | Array<FindConditions<BdBillView>>> {
        const {dbManager} = this.app;
        const where: FindConditions<BdBill> = {};
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
        if (params.dateTime) {
            const [startStr, endStr] = params.dateTime;
            const start = startStr && moment(startStr).toDate() || new Date(0);
            const end = endStr && moment(endStr).toDate() || new Date();
            where.dateTime = Between(start, end);
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
