import {BdBill, BdBillView, PageInfo} from "../../database";
import {RestFullService} from "../../typings/rest";
import BaseService from "../BaseService";

export default class Bill extends BaseService implements RestFullService {
    public async create(data: any): Promise<any> {
        const entity: BdBill = this.parseToEntity(BdBill, data);
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
        let entity: BdBill = this.parseToEntity(BdBill, data);
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
        let whereCondition = await this.toWhereCondition(params);
        return await dbManager.createQueryBuilder(BdBillView, "t")
            .where(whereCondition.where, whereCondition.params)
            .getMany();
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        const {dbManager} = this.app;
        let whereCondition = await this.toWhereCondition(params);
        return await dbManager.createPageQueryBuilder(BdBillView, "t")
            .where(whereCondition.where, whereCondition.params)
            .getPageData(pageInfo);
    }

    private async toWhereCondition(queryParam:any = {}): Promise<{ where: string, params: any }> {
        let where = " 1=1 ";
        const params: BdBillView & QueryParams = {...queryParam};
        if (params.id) {
            where += " and t.id = :id ";
        }
        if (params.userId) {
            where += " and t.id = @userId ";
        }
        if (params.billTypeId) {
            where += " and t.bill_type_id = @billTypeId ";
        }
        if (params.targetCardId) {
            where += " and t.target_card_id = @targetCardId ";
        }
        if (params.cardId) {
            where += " and t.card_id = @cardId ";
        }
        if (params.billDesc) {
            where += " and t.bill_desc = @billDesc ";
        }
        if (params.billTypeType) {
            where += " and t.bill_type_type = @billTypeType ";
        }
        if (params.cardIdOrTargetCardId) {
            where += " and (t.card_id = :cardIdOrTargetCardId or t.target_card_id = :cardIdOrTargetCardId)";
        }
        if (params.dateTime) {
            // @ts-ignore
            if (typeof params.dateTime) {
                where += ` and t.date_time = str_to_date(:dateTime,'%Y-%m-%d %H:%i:%s') `;
            } else if (Array.isArray(params.dateTime)) {
                const [start, end] = params.dateTime;
                if (start) {
                    params["dateTime>="] = start;
                }
                if (end) {
                    params["dateTime<="] = end;
                }
                delete params.dateTime;
            }
            delete params.dateTime;
        }
        if (params["dateTime>="]) {
            where += ` and t.date_time >= str_to_date(:dateTime>=,'%Y-%m-%d %H:%i:%s') `;
        }
        if (params["dateTime<="]) {
            where += ` and t.date_time <= str_to_date(:dateTime<=,'%Y-%m-%d %H:%i:%s') `;
        }
        if (params.keyword) {
            params.keyword = "%" + params.keyword + "%";
            let likeSql = " t.bill_desc like :keyword ";
            likeSql += " or t.user_name like :keyword ";
            likeSql += " or t.bill_type_name like :keyword ";
            where += ` and (${likeSql})`;
        }
        return {where, params};
    }
}

interface QueryParams {
    keyword?: string;
    cardIdOrTargetCardId: string;
    dateTime: string | [string, string],
}
