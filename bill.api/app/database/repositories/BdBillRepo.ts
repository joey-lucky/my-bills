import {DeepPartial, EntityRepository, FindConditions, FindOperator, getCustomRepository, getRepository} from "typeorm";
import {BdBill} from "../entity/BdBill";
import BaseRepository from "../BaseRepository";
import {BcUser} from "../entity/BcUser";
import {BcBillType} from "../entity/BcBillType";
import {BcCard} from "../entity/BcCard";
import moment = require("moment");
import {BdBillTransfer} from "../entity/BdBillTransfer";



@EntityRepository(BdBill)
export default class BdBillRepo extends BaseRepository<BdBill> {
    public async getViewPageData(pageInfo: PageInfo = {}, params: QueryParam = {}): Promise<[BdBillView[], PageInfo]> {
        let {pageIndex = 1, pageSize = 15} = pageInfo;
        const start = (pageSize * (pageIndex - 1));
        let conditions: FindConditions<BdBill>[] = [];
        if (params.id) {
            conditions.push({id: params.id});
        }
        if (params.userId) {
            conditions.push({user: await getRepository(BcUser).findOne(params.userId)});
        }
        if (params.cardId) {
            conditions.push({card: await getRepository(BcCard).findOne(params.cardId)});
        }
        if (params.billTypeId) {
            conditions.push({billType: await getRepository(BcBillType).findOne(params.billTypeId)});
        }
        if (params.dateTime) {
            if (params.dateTime[0]) {
                let datetimeStr = moment(params.dateTime[0]).format("YYYY-MM-DD HH:mm:ss");
                conditions.push({dateTime: new FindOperator("moreThanOrEqual", datetimeStr)});
            }
            if (params.dateTime[1]) {
                let datetimeStr = moment(params.dateTime[1]).format("YYYY-MM-DD HH:mm:ss");
                conditions.push({dateTime: new FindOperator("lessThanOrEqual", datetimeStr)});
            }
        }
        let [data, count] = await this.findAndCount({
            relations: [
                "card",
                "card.user",
                "user",
                "billType",
                "billTransfer",
                "billTransfer.targetCard",
                "billTransfer.targetCard.user"
            ],
            skip: start,
            take: pageSize,
            where: conditions,
            order: {
                dateTime: "DESC"
            },
        });
        let newPageInfo = {
            pageIndex,
            pageSize,
            count,
            pageCount: Math.ceil(count / pageSize)
        };
        let viewList = await this.entityToViewList(data);
        return [viewList, newPageInfo];
    }

    public async findOneView(id:string):Promise<BdBillView>{
        let entity = await this.findOne(id,{
            relations: [
                "card",
                "card.user",
                "user",
                "billType",
                "billTransfer",
                "billTransfer.targetCard",
                "billTransfer.targetCard.user"
            ],
        });
        return this.entityToView(entity);
    }

    public  async entityToView(entity: BdBill): Promise<BdBillView> {
        let userName =
            entity.user &&
            entity.user.name || "";
        let billTypeName =
            entity.billType &&
            entity.billType.name || "";
        let cardName =
            entity.card &&
            entity.card.name || "";
        let cardUserName =
            entity.card &&
            entity.card.user &&
            entity.card.user.name || "";
        let targetCardName =
            entity.billTransfer &&
            entity.billTransfer.targetCard &&
            entity.billTransfer.targetCard.name || "";
        let targetCardUserName =
            entity.billTransfer &&
            entity.billTransfer.targetCard &&
            entity.billTransfer.targetCard.user &&
            entity.billTransfer.targetCard.user.name || "";
        return {
            userName, billTypeName, cardName, cardUserName, targetCardName, targetCardUserName,
            id: entity.id,
            money: entity.money,
            billDesc: entity.billDesc,
            dateTime: entity.dateTime,
        };
    }

    async entityToViewList(entities: BdBill[] = []): Promise<BdBillView[]> {
        let views: BdBillView[] = [];
        for (let entity of entities) {
            views.push(await this.entityToView(entity));
        }
        return views;
    }
}

interface PageInfo {
    pageIndex?: number,
    pageSize?: number,
    pageCount?: number,
    count?: number,
}

interface QueryParam {
    id?:string,
    userId?: string,
    cardId?: string,
    billTypeId?: string,
    dateTime?: Date[]
}

export interface BdBillView {
    id: string,
    money: number,
    billDesc: string,
    dateTime: string,
    cardName: string,
    cardUserName: string,
    userName: string,
    billTypeName: string,
    targetCardName: string,
    targetCardUserName: string,
}