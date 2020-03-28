import {Service} from "egg";
import {BaseEntity, findAndCount, PageInfo} from "../database";
import {DeepPartial, FindManyOptions, getManager, ObjectType} from "typeorm";

export class BaseService extends Service {
    protected getCtxUserId() {
        return this.ctx.user.id;
    }

    protected parseToEntity<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, plainObject?: DeepPartial<Entity>): Entity {
        return getManager().create(entityClass, plainObject);
    }

    protected parseToEntities<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, plainObject?: DeepPartial<Entity>[]): Entity[] {
        let entities = [];
        for (let obj of plainObject) {
            entities.push(getManager().create(entityClass, obj));
        }
        return entities;
    }

    protected async createEntity<Entity extends BaseEntity>(entity: Entity) {
        entity.createBy = this.getCtxUserId();
        entity.updateBy = this.getCtxUserId();
        entity.createTime = new Date();
        entity.updateTime = new Date();
        await getManager().save(entity.constructor, entity);
    }

    protected async updateEntity<Entity extends BaseEntity>(entity: Entity) {
        entity.updateBy = this.getCtxUserId();
        entity.updateTime = new Date();
        await getManager().save(entity.constructor, entity);
    }

    protected async deleteEntity<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, id: string) {
        await getManager().delete(entityClass, id);
    }

    protected async findPageData<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, options?: FindManyOptions<Entity>, pageInfo = this.getPageInfo()): Promise<[Entity[], PageInfo]> {
        let {pageIndex = 1, pageSize = Number.MAX_SAFE_INTEGER} = pageInfo;
        const start = (pageSize * (pageIndex - 1));
        options.take = pageSize;
        options.skip = start;
        let [data, count] = await findAndCount(entityClass, options);
        let newPageInfo: PageInfo = {
            pageIndex,
            pageSize,
            count,
            pageCount: Math.ceil(count / pageSize)
        };
        return [data, newPageInfo];
    }

    // 解析ctx表数据
    protected getRequestTableData<Entity extends BaseEntity>(tableName: string): DeepPartial<Entity>[] {
        return this.ctx.request.queryObjects[tableName] || [];
    }

    // 解析ctx表数据第一个
    protected getRequestTableFirstData<Entity extends BaseEntity>(tableName: string): DeepPartial<Entity> {
        let tableData: DeepPartial<Entity>[] = this.getRequestTableData(tableName);
        return tableData && tableData[0];
    }

    protected getQueryObjects(): any {
        return this.ctx.request.queryObjects;
    }

    protected getString(key: string): string {
        let objects = this.getQueryObjects();
        return objects[key] || "";
    }

    protected getPageInfo() {
        let objects = this.getQueryObjects();
        return objects.pageInfo;
    }
}