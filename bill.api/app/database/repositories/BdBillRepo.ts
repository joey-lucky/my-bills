import {EntityRepository} from "typeorm";
import {BdBill} from "../entity/BdBill";
import BaseRepository from "../BaseRepository";

@EntityRepository(BdBill)
export default class BdBillRepo extends BaseRepository<BdBill> {
    public async getViewPageData(pageInfo: PageInfo = {}, params: QueryParam = {}): Promise<[BdBillView[], PageInfo]> {
        let {pageIndex = 1, pageSize = Number.MAX_SAFE_INTEGER} = pageInfo;
        const start = (pageSize * (pageIndex - 1));
        let where = this.queryParamsToWhere(params);
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
            where: where,
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

    public async getViewList(params: QueryParam = {}):Promise<BdBillView[]> {
        let where = this.queryParamsToWhere(params);
        let data = await this.find({
            relations: [
                "card",
                "card.user",
                "user",
                "billType",
                "billTransfer",
                "billTransfer.targetCard",
                "billTransfer.targetCard.user"
            ],
            where: where,
            order: {
                dateTime: "DESC"
            },
        });
        return await this.entityToViewList(data);
    }

    public async findOneView(id: string): Promise<BdBillView> {
        let entity = await this.findOne(id, {
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

    public async entityToView(entity: BdBill): Promise<BdBillView> {
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
        let targetCardId =
            entity.billTransfer &&
            entity.billTransfer.targetCard &&
            entity.billTransfer.targetCard.id || "";
        let bdBill = {...entity};
        delete bdBill.user;
        delete bdBill.billType;
        delete bdBill.card;
        delete bdBill.billTransfer;
        return {
            ...bdBill,
            userName,
            billTypeName,
            cardName,
            cardUserName,
            targetCardName,
            targetCardUserName,
            targetCardId
        };
    }

    private async entityToViewList(entities: BdBill[] = []): Promise<BdBillView[]> {
        let views: BdBillView[] = [];
        for (let entity of entities) {
            views.push(await this.entityToView(entity));
        }
        return views;
    }

    private queryParamsToWhere(params) {
        let where = " 1 = 1 ";
        if (params.id) {
            where += ` and BdBill.id = '${params.id}'`;
        }
        if (params.userId) {
            where += ` and BdBill.user_id = '${params.userId}'`;
        }
        if (params.cardId) {
            where += ` and BdBill.card_id = '${params.cardId}'`;
        }
        if (params.billTypeId) {
            where += ` and BdBill.bill_type_id = '${params.billTypeId}'`;
        }
        if (params.dateTime) {
            let [start,end] = params.dateTime;
            if (start) {
                where += ` and BdBill.date_time >= str_to_date('${start}','%Y-%m-%d %H:%i:%s')`;
            }
            if (end) {
                where += ` and BdBill.date_time <= str_to_date('${end}','%Y-%m-%d %H:%i:%s')`;
            }
        }
        return where;
    }
}

interface PageInfo {
    pageIndex?: number,
    pageSize?: number,
    pageCount?: number,
    count?: number,
}

interface QueryParam {
    id?: string,
    userId?: string,
    cardId?: string,
    billTypeId?: string,
    dateTime?: string[],
    money?: number[]
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
    billTypeId: string;
    userId: string;
    cardId: string;
    targetCardId: string;
}