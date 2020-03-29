import {BaseEntity} from "../BaseEntity";
import {TranslateColumnOptions} from "./TranslateColumnOptions";

interface ColumnOptions {
    target: Function;
    propertyName: string;
    options: TranslateColumnOptions;
}

const foreignKeyEntity: {[key: string]: typeof BaseEntity} = {};
const translateColumnList: ColumnOptions[] = [];
const translateColumnMap: { [key: string]: ColumnOptions[]; } = {};

export function setForeignKeyEntity(key: string, Entity: typeof BaseEntity) {
    foreignKeyEntity[key] = Entity;
}

export function pushTranslateColumn(column: ColumnOptions) {
    translateColumnList.push(column);
    const name = column.target.name;
    if (!translateColumnMap[name]) {
        translateColumnMap[name] = [];
    }
    translateColumnMap[name].push(column);
}

export function getTranslateColumns(target: Function) : ColumnOptions[]{
    return translateColumnMap[target.name] || [];
}

export function getForeignKeyEntity(foreignKey: string): typeof BaseEntity{
    return foreignKeyEntity[foreignKey];
}