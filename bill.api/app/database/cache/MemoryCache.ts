import {BaseEntity, ObjectType} from "typeorm";
import {setCacheEntityConfig} from "./CacheData";
import {MemoryCacheOptions} from "./MemoryCacheOptions";

export function MemoryCache<Entity extends BaseEntity>(options:MemoryCacheOptions) {
    return function (entityClass:ObjectType<Entity>) {
        setCacheEntityConfig(entityClass, options);
    }
}
