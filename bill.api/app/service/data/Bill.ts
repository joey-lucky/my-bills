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
        const sqlObj = await this.toSql(params);
        return await dbManager.query(sqlObj.sql, sqlObj.params);
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        const {dbManager} = this.app;
        const sqlObj = await this.toSql(params);
        return await dbManager.queryPage(sqlObj.sql, sqlObj.params, pageInfo);
    }

    private async toSql(requestParams): Promise<{ sql: string, params: any }> {
        const {dbManager} = this.app;
        let params: any = {};
        let whereSql = "where 1=1 ";
        if (requestParams.id) {
            params.id = requestParams.id;
            whereSql += " and bd_bill_view.id = @id ";
        }
        if (requestParams.userId) {
            params.userId = requestParams.userId;
            whereSql += " and bd_bill_view.user_id = @userId ";
        }
        if (requestParams.billTypeId) {
            params.billTypeId = requestParams.billTypeId;
            whereSql += " and bd_bill_view.bill_type_id = @billTypeId ";
        }
        if (requestParams.targetCardId) {
            params.targetCardId = requestParams.targetCardId;
            whereSql += " and bd_bill_view.target_card_id = @targetCardId ";
        }
        if (requestParams.cardId) {
            params.cardId = requestParams.cardId;
            whereSql += " and bd_bill_view.card_id = @cardId ";
        }
        if (requestParams.billDesc) {
            params.billDesc = requestParams.billDesc;
            whereSql += " and bd_bill_view.bill_desc = @billDesc ";
        }
        if (requestParams.billTypeType) {
            params.billTypeType = requestParams.billTypeType;
            whereSql += " and bd_bill_view.bill_type_type = @billTypeType ";
        }
        if (requestParams.dateTime) {
            const [startStr, endStr] = requestParams.dateTime;
            if (startStr) {
                params.startStr = requestParams.startStr;
                whereSql += ` and bd_bill_view.date_time >= str_to_date('${startStr}','%Y-%m-%d %H:%i:%s') `;
            }
            if (endStr) {
                params.endStr = requestParams.endStr;
                whereSql += ` and bd_bill_view.date_time <= str_to_date('${endStr}','%Y-%m-%d %H:%i:%s') `;
            }
        }
        if (requestParams.cardIdOrTargetCardId) {
            params.cardIdOrTargetCardId = requestParams.cardIdOrTargetCardId;
            whereSql += " and (bill.card_id = @cardIdOrTargetCardId or bd_bill_view.target_card_id = @cardIdOrTargetCardId)";
        }
        if (requestParams.cardIdOrTargetCardId) {
            params.cardIdOrTargetCardId = requestParams.cardIdOrTargetCardId;
            whereSql += " and (bill.card_id = @cardIdOrTargetCardId or bd_bill_view.target_card_id = @cardIdOrTargetCardId)";
        }
        if (requestParams.keyword) {
            params.keyword = "%" + requestParams.keyword + "%";
            let likeSql = " bd_bill_view.bill_desc like @keyword ";
            likeSql += " or bd_bill_view.user_name like @keyword ";
            likeSql += " or bd_bill_view.bill_type_name like @keyword ";
            whereSql += ` and (${likeSql})`;
        }
        let selectSql = await dbManager.getSelectSql("bd_bill_view");
        let orderSql = "order by bd_bill_view.date_time desc , bd_bill_view.bill_type_id desc";
        let sql = `${selectSql} ${whereSql} ${whereSql} ${orderSql}`;
        return {sql, params};
    }
}
