import {Between, DeepPartial, FindConditions, In, Like} from "typeorm";
import {BcBillType, BdBill, find, findOne} from "../../database";
import Assert from "../../utils/Assert";
import {BaseService} from "../BaseService";
import moment = require("moment");

export default class BdBillService extends BaseService {
    async create(): Promise<void> {
        let data: DeepPartial<BdBill> = this.getRequestTableFirstData("data");
        data.userId = this.getCtxUserId();
        let entity: BdBill = this.parseToEntity(BdBill, data);
        await this.createEntity(entity);
    }

    async update(): Promise<void> {
        let data: DeepPartial<BdBill> = this.getRequestTableFirstData("data");
        data.userId = this.getCtxUserId();
        let entity: BdBill = this.parseToEntity(BdBill, data);
        await this.updateEntity(entity);
    }

    async delete(): Promise<void> {
        let id = this.getString("id");
        let bill = await findOne(BdBill, id);
        Assert.isTrue(!!bill, "账单不存在");
        await this.deleteEntity(BdBill, id);
    }

    async getList(params = this.getQueryObjects()): Promise<BdBill[]> {
        return await find(BdBill, {where: await this.toFindConditions(params), order: {dateTime: "DESC"}});
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
