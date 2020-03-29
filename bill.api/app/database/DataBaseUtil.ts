import {BaseEntity, FindManyOptions, getManager, ObjectType} from "typeorm";
import {findOneWithCache} from "./cache";

export interface PageInfo {
    pageIndex?: number;
    pageSize?: number;
    pageCount?: number;
    count?: number;
}

export async function find<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, options?: FindManyOptions<Entity>) {
    return await getManager().find(entityClass, options);
}

export async function findOne<T extends BaseEntity>(entityClass: ObjectType<T>, id: string): Promise<T> {
    return await findOneWithCache(entityClass, id);
}

export async function findAndCount<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, options?: FindManyOptions<Entity>): Promise<[Entity[], number]> {
    return await getManager().findAndCount(entityClass, options);
}
