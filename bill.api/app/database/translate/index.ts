import {BaseEntity} from "typeorm";
import {getForeignKeyEntity, getTranslateColumns} from "./TranslateConfig";
import {findOneWithCache} from "../cache";

export * from "./TranslateColumn";
export * from "./TranslateSource";

function defGetSourceValue(entity: BaseEntity) {
    // @ts-ignore
    return entity.name;
}

export async function translate(obj: BaseEntity) {
    let columns = getTranslateColumns(obj.constructor);
    for (let column of columns) {
        let {propertyName, options} = column;
        let {foreignKey, target, getSourceValue = defGetSourceValue} = options;
        let sourceId = obj[foreignKey];
        target = target || getForeignKeyEntity(foreignKey);
        if (sourceId && target) {
            let entity = await findOneWithCache(target, sourceId);
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