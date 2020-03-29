import {Between, DeepPartial, FindConditions, In, Like} from "typeorm";
import {BcBillType, BdBill, find, findOne} from "../../database";
import Assert from "../../utils/Assert";
import {BaseService} from "../BaseService";
import moment = require("moment");

export default class BdBillService extends BaseService {
    async create(): Promise<void> {
        const data: DeepPartial<BdBill> = this.getRequestTableFirstData("data");
        data.userId = this.getCtxUserId();
        const entity: BdBill = this.parseToEntity(BdBill, data);
        await this.createEntity(entity);
    }

    async update(): Promise<void> {
        const data: DeepPartial<BdBill> = this.getRequestTableFirstData("data");
        data.userId = this.getCtxUserId();
        const entity: BdBill = this.parseToEntity(BdBill, data);
        await this.updateEntity(entity);
    }

    async delete(): Promise<void> {
        const id = this.getString("id");
        const bill = await findOne(BdBill, id);
        Assert.isTrue(!!bill, "账单不存在");
        await this.deleteEntity(BdBill, id);
    }

    async getList(params = this.getQueryObjects()): Promise<BdBill[]> {
        return await find(BdBill, {where: await this.toFindConditions(params), order: {dateTime: "DESC"}});
    }

    async getPageData(params = this.getQueryObjects()) {
        const where = await this.toFindConditions();
        const {pageInfo} = params;
        return await this.findPageData(BdBill, {where, order: {dateTime: "DESC"}}, pageInfo);
    }

    private async toFindConditions(params = this.getQueryObjects()): Promise<FindConditions<BdBill> | Array<FindConditions<BdBill>>> {
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
            const billTypeList = await find(BcBillType, {where: {type: params.billTypeType}});
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
