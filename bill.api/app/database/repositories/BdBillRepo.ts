import {EntityRepository, FindConditions, FindOperator, getCustomRepository, getRepository} from "typeorm";
import {BdBill} from "../entity/BdBill";
import BaseRepository from "../BaseRepository";
import {BcUser} from "../entity/BcUser";
import {BcBillType} from "../entity/BcBillType";
import BcCardRepo from "./BcCardRepo";
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

export interface BdBillView {
    id:string,
    money: number,
    billDesc: string,
    dateTime: string,
    cardName: string,
    cardUserName:string,
    userName: string,
    billTypeName: string,
    targetCardName:string,
    targetCardUserName:string,
}

@EntityRepository(BdBill)
export default class BdBillRepo extends BaseRepository<BdBill> {
    async getViewPageData(pageInfo: PageInfo, params: QueryParam): Promise<[BdBillView[], PageInfo]> {
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
            },
            // loadEagerRelations:true,
        });
        pageInfo.count = count;
        pageInfo.pageCount = Math.ceil(count / pageInfo.pageSize);
        let viewList = await this.entityToViewList(data);
        return [viewList, pageInfo];
    }

    async entityToView(entity:BdBill):Promise<BdBillView>{
        let view: BdBillView = {
            id: entity.id,
            money: entity.money,
            billDesc: entity.billDesc,
            dateTime: entity.dateTime,
            cardName: "",
            cardUserName: "",
            userName: "",
            billTypeName: "",
            targetCardName: "",
            targetCardUserName: "",
        };
        if (entity.card === null ||entity.card.user===null) {
            let child = await getCustomRepository(BcCardRepo).findViewOne(entity.card.id);
            view.cardName = child.name;
            view.cardUserName = child.userName;
        }
        if (entity.user === null) {
            let child = await getRepository(BcUser).findOne(entity.userId);
            view.userName = child.name;
        }
        if (entity.billType === null) {
            let child = await getRepository(BcBillType).findOne(entity.billTypeId);
            view.billTypeName = child.name;
        }
        if (entity.billTransfer !== null) {
            let child = await getCustomRepository(BcCardRepo).findViewOne(entity.billTransfer.targetCardId);
            view.targetCardName = child.name;
            view.targetCardUserName = child.userName;
        }
        return view;
    }

    async entityToViewList(entities:BdBill[] = []):Promise<BdBillView[]>{
        let views:BdBillView[] = [];
        for (let entity of entities) {
            views.push(await this.entityToView(entity));
        }
        return views;
    }
}