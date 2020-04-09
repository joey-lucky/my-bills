import {Entity as TypeOrmEntity,EntityOptions} from "typeorm";
// BcUser --> bc_user
export function Entity(options?: EntityOptions): Function {
    return function (target: Function) {
        let tableName = target.name.replace(/([A-Z]|[0-9]+)/g, (str) => "_" + str.toLowerCase()).substr(1);
        TypeOrmEntity(tableName, options)(target);
    };
}
