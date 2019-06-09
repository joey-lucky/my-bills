import {EntityRepository, FindConditions, FindOperator, getRepository} from "typeorm";
import {BdBill} from "../entity/BdBill";
import BaseRepository from "../BaseRepository";
import moment = require("moment");

interface PageInfo {
    pageIndex?: number,
    pageSize?: number,
    pageCount?: number,
    count?: number,
}

interface QueryParam {
    userId?: string,
    cardId?: string,
    billTypeId?: string,
    dateTime?: Date[]
}

@EntityRepository(BdBill)
export default class BdBillRepo extends BaseRepository<BdBill> {
    async getPageData(pageInfo: PageInfo, params: QueryParam): Promise<[BdBill[], PageInfo]> {
        let {pageIndex = 1, pageSize = 15} = pageInfo;
        let {userId, cardId, billTypeId, dateTime} = params;
        const start = (pageSize * (pageIndex - 1));
        let conditions: FindConditions<BdBill>[] = [];
        if (userId) {
            conditions.push({userId: userId});
        }
        if (cardId) {
            conditions.push({cardId: cardId});
        }
        if (billTypeId) {
            conditions.push({billTypeId: billTypeId});
        }
        if (dateTime) {
            if (dateTime[0]) {
                let datetimeStr = moment(dateTime[0]).format("YYYY-MM-DD HH:mm:ss");
                conditions.push({dateTime: new FindOperator("moreThanOrEqual", datetimeStr)});
            }
            if (dateTime[1]) {
                let datetimeStr = moment(dateTime[1]).format("YYYY-MM-DD HH:mm:ss");
                conditions.push({dateTime: new FindOperator("lessThanOrEqual", datetimeStr)});
            }
        }

        let [data, count] = await this.findAndCount({
            relations: ["card", "user", "billType", "billTransfer"],
            skip: start,
            take: pageSize,
            where: conditions,
            order: {
                dateTime: "DESC"
            }
        });
        pageInfo.count = count;
        pageInfo.pageCount = Math.ceil(count / pageInfo.pageSize);
        return [data, pageInfo];
    }
}