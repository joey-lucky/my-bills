import {BaseEntity} from "typeorm";
import {findOneWithCache} from "../cache";
import {getForeignKeyEntity, getTranslateColumns} from "./TranslateConfig";

export * from "./TranslateColumn";
export * from "./TranslateSource";

function defGetSourceValue(entity: BaseEntity) {
    // @ts-ignore
    return entity.name;
}

export async function translate(obj: BaseEntity) {
    const columns = getTranslateColumns(obj.constructor);
    for (const column of columns) {
        const {propertyName, options} = column;
        let {foreignKey, target, getSourceValue = defGetSourceValue} = options;
        const sourceId = obj[foreignKey];
        target = target || getForeignKeyEntity(foreignKey);
        if (sourceId && target) {
            const entity = await findOneWithCache(target, sourceId);
            if (entity) {
                let value = getSourceValue(entity);
                if (value instanceof Promise) {
                    value = await value;
                }
                obj[propertyName] = value;
            }
        }
    }
}