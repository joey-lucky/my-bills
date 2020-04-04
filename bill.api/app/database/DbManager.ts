import {
    BaseEntity,
    DeepPartial, DeleteResult,
    EntityManager,
    EntitySchema,
    FindManyOptions,
    ObjectID,
    ObjectType,
    SaveOptions
} from "typeorm";
import {Application} from "egg";

export interface PageInfo {
    pageIndex?: number;
    pageSize?: number;
    pageCount?: number;
    count?: number;
}

export class DbManager {
    private manager: EntityManager;
    private app: Application;

    constructor(app:Application,manager: EntityManager) {
        this.manager = manager;
        this.app = app;
    }

    async find<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, options?: FindManyOptions<Entity>):Promise<Entity[]> {
        return await this.manager.find(entityClass, options);
    }

    async findOne<T extends BaseEntity>(entityClass: ObjectType<T>, id: string): Promise<T> {
        return await this.manager.findOne(entityClass, id);
    }

    async findAndCount<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, options?: FindManyOptions<Entity>): Promise<[Entity[], number]> {
        return await this.manager.findAndCount(entityClass, options);
    }

    create<Entity>(entityClass: ObjectType<Entity>, plainObject?: DeepPartial<Entity>): Entity{
        return this.manager.create(entityClass, plainObject);
    }

    save<Entity, T extends DeepPartial<Entity>>(targetOrEntity: ObjectType<Entity> | EntitySchema<Entity>, entity: T, options?: SaveOptions): Promise<T>{
        return this.manager.save(targetOrEntity, entity,options);
    }

    delete<Entity>(targetOrEntity: ObjectType<Entity> | EntitySchema<Entity> | string, criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any): Promise<DeleteResult>{
        return this.manager.delete(targetOrEntity, criteria);
    }
}