import {Service} from "egg";
import {DeepPartial, FindManyOptions, ObjectType} from "typeorm";
import {BaseEntity, PageInfo} from "../database";
import Assert from "../utils/Assert";

export default class BaseService extends Service {
    protected async assertEntityIdExist<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, id: string): Promise<Entity> {
        let entity: Entity = await this.app.database.findOne(entityClass, id);
        Assert.isTrue(!!entity, `id=${id} not exist`);
        return entity;
    }

    protected getCtxUserId() {
        return this.ctx.user.id;
    }

    protected parseToEntity<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, plainObject?: DeepPartial<Entity>): Entity {
        return this.app.database.create(entityClass, plainObject);
    }

    protected parseToEntities<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, plainObject?: Array<DeepPartial<Entity>>): Entity[] {
        const entities = [];
        for (const obj of plainObject) {
            entities.push(this.app.database.create(entityClass, obj));
        }
        return entities;
    }

    protected async createEntity<Entity extends BaseEntity>(entity: Entity) {
        entity.createBy = this.getCtxUserId();
        entity.updateBy = this.getCtxUserId();
        entity.createTime = new Date();
        entity.updateTime = new Date();
        await this.app.database.save(entity.constructor, entity);
    }

    protected async updateEntity<Entity extends BaseEntity>(entity: Entity) {
        entity.updateBy = this.getCtxUserId();
        entity.updateTime = new Date();
        await this.app.database.save(entity.constructor, entity);
    }

    protected async deleteEntity<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, id: string) {
        await this.app.database.delete(entityClass, id);
    }

    protected async findPageData<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, options?: FindManyOptions<Entity>, pageInfo = this.getPageInfo()): Promise<[Entity[], PageInfo]> {
        const {pageIndex = 1, pageSize = Number.MAX_SAFE_INTEGER} = pageInfo;
        const start = (pageSize * (pageIndex - 1));
        options.take = pageSize;
        options.skip = start;
        const [data, count] = await this.app.database.findAndCount(entityClass, options);
        const newPageInfo: PageInfo = {
            pageIndex,
            pageSize,
            count,
            pageCount: Math.ceil(count / pageSize),
        };
        return [data, newPageInfo];
    }

    // 解析ctx表数据
    protected getRequestTableData<Entity extends BaseEntity>(tableName: string): Array<DeepPartial<Entity>> {
        return this.ctx.request.queryObjects[tableName] || [];
    }

    // 解析ctx表数据第一个
    protected getRequestTableFirstData<Entity extends BaseEntity>(tableName: string): DeepPartial<Entity> {
        const tableData: Array<DeepPartial<Entity>> = this.getRequestTableData(tableName);
        return tableData && tableData[0];
    }

    protected getQueryObjects(): any {
        return this.ctx.request.queryObjects;
    }

    protected getString(key: string): string {
        const objects = this.getQueryObjects();
        return objects[key] || "";
    }

    protected getPageInfo() {
        const objects = this.getQueryObjects();
        return objects.pageInfo;
    }
}