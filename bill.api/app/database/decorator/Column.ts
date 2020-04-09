import {Column as TypeOrmColumn, ColumnOptions} from "typeorm";

export function Column(options: ColumnOptions = {}) {
    return function (object: Object, propertyName: string) {
        options.name = propertyName.replace(/([A-Z]|[0-9]+)/g, (str) => "_" + str.toLowerCase());
        TypeOrmColumn(options)(object,propertyName);
    };
}
