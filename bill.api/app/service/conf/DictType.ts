import {BcDictData, BcDictType, PageInfo} from "../../database";
import {RestFullService} from "../../typings/rest";
import BaseService from "../BaseService";
import Assert from "../../utils/Assert";

export default class DictType extends BaseService implements RestFullService {
    public async create(data: any): Promise<any> {
        const entity: BcDictType = this.parseToEntity(BcDictType, data);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const {database} = this.app;
        const entity = await this.assertEntityIdExist(BcDictType, id);
        let children = await database.find(BcDictData, {where: {typeCode: entity.code}});
        Assert.isTrue(children.length === 0, "children not null");
        await this.deleteEntity(BcDictType, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BcDictType, id);
        const entity: BcDictType = this.parseToEntity(BcDictType, data);
        entity.id = id;
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BcDictType, id);
    }

    public async index(params: any): Promise<any[]> {
        const {database} = this.app;
        let whereCondition = await this.toWhereCondition(params);
        return await database.createQueryBuilder(BcDictType, "t")
            .where(whereCondition.where, whereCondition.params)
            .getMany();
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        const {database} = this.app;
        let whereCondition = await this.toWhereCondition(params);
        return await database.createPageQueryBuilder(BcDictType, "t")
            .where(whereCondition.where, whereCondition.params)
            .getPageData(pageInfo);
    }

    private async toWhereCondition(queryParam:any = {}): Promise<{ where: string, params: any }> {
        let where = " 1=1 ";
        const params: BcDictType & QueryParams = {...queryParam};
        if (params.id) {
            where += " and t.id = :id ";
        }
        if (params.value) {
            where += " and t.value = :value ";
        }
        if (params.code) {
            where += " and t.code = :code ";
        }
        if (params.keyword) {
            params.keyword = "%" + params.keyword + "%";
            let likeSql = " t.code like :keyword ";
            likeSql += " or t.value like :keyword ";
            where += ` and (${likeSql})`;
        }
        return {where, params};
    }
}
interface QueryParams {
    keyword?: string;
}
