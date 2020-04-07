import {BcBillType, BcCard, BcCardView, PageInfo} from "../../database";
import {RestFullService} from "../../typings/rest";
import BaseService from "../BaseService";
import {FindConditions, In, Like} from "typeorm";

export default class Card extends BaseService implements RestFullService {
    public async create(data: any): Promise<any> {
        const entity: BcCard = this.parseToEntity(BcCard, data);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BcCard, id);
        await this.deleteEntity(BcCard, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BcCard, id);
        const entity: BcCard = this.parseToEntity(BcCard, data);
        entity.id = id;
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BcCard, id);
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
            whereSql += " and cardView.id = @id ";
        }
        if (requestParams.userId) {
            params.userId = requestParams.userId;
            whereSql += " and cardView.user_id = @userId ";
        }
        if (requestParams.cardTypeId) {
            params.cardTypeId = requestParams.cardTypeId;
            whereSql += " and cardView.card_type_id = @cardTypeId ";
        }
        if (requestParams.name) {
            params.name = requestParams.name;
            whereSql += " and cardView.name = @name ";
        }
        if (requestParams.keyword) {
            params.keyword = "%" + requestParams.keyword + "%";
            let likeSql = " cardView.name like @keyword ";
            whereSql += ` and (${likeSql})`;
        }
        let selectSql = await dbManager.getSelectSql("bc_card_view",{alias:"cardView"});
        let orderSql = `order by cardView.user_id desc`;
        let sql = `${selectSql} ${whereSql} ${orderSql}`;
        return {sql, params};
    }
}
