import {BcBillType, BcCard, BcCardView, BdBillView, PageInfo} from "../../database";
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
        const {database} = this.app;
        let whereCondition = await this.toWhereCondition(params);
        return await database.createQueryBuilder(BcCardView, "t")
            .where(whereCondition.where, whereCondition.params)
            .getMany();
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        const {database} = this.app;
        let whereCondition = await this.toWhereCondition(params);
        return await database.createPageQueryBuilder(BcCardView, "t")
            .where(whereCondition.where, whereCondition.params)
            .getPageData(pageInfo);
    }

    private async toWhereCondition(queryParam:any = {}): Promise<{ where: string, params: any }> {
        let where = " 1=1 ";
        const params: BcCardView & QueryParams = {...queryParam};
        if (params.id) {
            where += " and t.id = :id ";
        }
        if (params.name) {
            where += " and t.name = :name ";
        }
        if (params.balance) {
            where += " and t.balance = :balance ";
        }
        if (params.userId) {
            where += " and t.user_id = :userId ";
        }
        if (params.keyword) {
            params.keyword = "%" + params.keyword + "%";
            let likeSql = " t.name like :keyword ";
            likeSql += " or t.card_type_name like :keyword ";
            likeSql += " or t.user_name like :keyword ";
            likeSql += " or t.balance like :keyword ";
            where += ` and (${likeSql})`;
        }
        return {where, params};
    }
}

interface QueryParams {
    keyword?: string;
}
