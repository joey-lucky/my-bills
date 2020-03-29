import {BaseEntity, getManager, ObjectType} from "typeorm";
import {MemoryCacheOptions} from "./MemoryCacheOptions";

const needCacheEntity: { [key: string]: { options: MemoryCacheOptions, target?: ObjectType<BaseEntity> } } = {};
const cache = {};
const cacheValidTime = {};

export function setCacheEntityConfig<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, options: MemoryCacheOptions) {
    needCacheEntity[entityClass.name] = {
        target: entityClass,
        options,
    };
}

export async function findOneWithCache<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, id: string) {
    const entityClassName = entityClass.name;
    if (!!needCacheEntity[entityClassName]) {
        const expires = cacheValidTime[entityClassName] || 0;
        if (expires < Date.now()) {//过期
            await initCache(entityClass);
        }
        let entity = cache[entityClassName][id] ;
        if (!entity) { //缓存不存在，则查库并加入到缓存
            entity = await getManager().findOne(entityClass, id);
            cache[entityClassName][id] = entity;
        }
        return entity;
    } else {
        return await getManager().findOne(entityClass, id);
    }
}

export async function initCache<Entity extends BaseEntity>(entityClass: ObjectType<Entity>) {
    const entityClassName = entityClass.name;
    const expires = cacheValidTime[entityClassName] || 0;
    if (expires < Date.now()) {//过期
        const cacheEntity = needCacheEntity[entityClassName];
        const expires = cacheEntity && cacheEntity.options && cacheEntity.options.expires || (60 * 60 * 1000);
        const validCacheTime = Date.now() + expires;
        const rows: BaseEntity[] = await getManager().find(entityClass);
        const entityCache = {};
        for (const row of rows) {
            // @ts-ignore
            entityCache[row.id] = row;
        }
        cache[entityClassName] = entityCache;
        cacheValidTime[entityClassName] = validCacheTime;
    }
}

export async function initAllCache() {
    for (const value of Object.values(needCacheEntity)) {
        await initCache(value.target);
    }
}
