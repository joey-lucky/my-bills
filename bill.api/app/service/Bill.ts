import {BaseService} from "./BaseService";
import {RestFullService} from "../typings/rest";
import {BcBillType, BdBill, find, findOne} from "../database";
import {Between, FindConditions, In, Like} from "typeorm";
import Assert from "../utils/Assert";
import moment = require("moment");

export default abstract class Bill extends BaseService implements RestFullService {
    public async destroy(id: string): Promise<any> {
        let bill = await findOne(BdBill, id);
        Assert.isTrue(!!bill, "账单不存在");
        await this.deleteEntity(BdBill, id);
    }

    public async index(params: any): Promise<any[]> {
        let where = await this.toFindConditions(params);
        return await find(BdBill, {where, order: {dateTime: "DESC"}});
    }

    public async show(id: string): Promise<any> {
        return undefined;
    }

    public async create(data: any): Promise<any> {
        return undefined;
    }

    public async update(id: string, data): Promise<any> {
        return undefined;
    }

    async getPageData(params = this.getQueryObjects()) {
        let where = await this.toFindConditions();
        let {pageInfo} = params;
        return await this.findPageData(BdBill, {where, order: {dateTime: "DESC"}}, pageInfo);
    }

    private async toFindConditions(params = this.getQueryObjects()): Promise<FindConditions<BdBill> | FindConditions<BdBill>[]> {
        let where: FindConditions<BdBill> = {};
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
            let billTypeList = await find(BcBillType, {where: {type: params.billTypeType}});
            let billTypeIdList: string[] = billTypeList.map(item => item.id);
            where.billTypeId = In(billTypeIdList);
        }
        if (params.dateTime) {
            let [startStr, endStr] = params.dateTime;
            let start = startStr && moment(startStr).toDate() || new Date(0);
            let end = endStr && moment(endStr).toDate() || new Date();
            where.dateTime = Between(start, end);
        }
        if (params.billDesc) {
            where.billDesc = Like(`%${params.billDesc}%`);
        }
        if (params.cardId) {
            return [
                {
                    ...where,
                    cardId: params.cardId
                },
                {
                    ...where,
                    targetCardId: params.cardId
                },
            ];
        }
        return where;

    }
}
