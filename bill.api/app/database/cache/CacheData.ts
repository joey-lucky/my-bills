import {BaseEntity, getManager, ObjectType} from "typeorm";
import {MemoryCacheOptions} from "./MemoryCacheOptions";

const needCacheEntity: { [key: string]: { options: MemoryCacheOptions, target?: ObjectType<BaseEntity> } } = {};
const cache = {};
const cacheValidTime = {};

export function setCacheEntityConfig<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, options: MemoryCacheOptions) {
    needCacheEntity[entityClass.name] = {
        target: entityClass,
        options: options
    };
}

export async function findOneWithCache<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, id: string) {
    let entityClassName = entityClass.name;
    if (!!needCacheEntity[entityClassName]) {
        let expires = cacheValidTime[entityClassName] || 0;
        if (expires < Date.now()) {//过期
            await initCache(entityClass);
        }
        return cache[entityClassName][id];
    } else {
        return await getManager().findOne(entityClass, id);
    }
}

export async function initCache<Entity extends BaseEntity>(entityClass: ObjectType<Entity>) {
    let entityClassName = entityClass.name;
    let expires = cacheValidTime[entityClassName] || 0;
    if (expires < Date.now()) {//过期
        let cacheEntity = needCacheEntity[entityClassName];
        let expires = cacheEntity && cacheEntity.options && cacheEntity.options.expires || (60 * 60 * 1000);
        let validCacheTime = Date.now() + expires;
        let rows: BaseEntity[] = await getManager().find(entityClass);
        let entityCache = {};
        for (let row of rows) {
            // @ts-ignore
            entityCache[row.id] = row;
        }
        cache[entityClassName] = entityCache;
        cacheValidTime[entityClassName] = validCacheTime;
    }
}

export async function initAllCache() {
    for (let value of Object.values(needCacheEntity)) {
        await initCache(value.target);
    }
}
