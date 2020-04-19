import {ViewEntity as TypeOrmViewEntity} from "typeorm";
import {ViewEntityOptions} from "typeorm/decorator/options/ViewEntityOptions";

// BcUser --> bc_user
export function ViewEntity(options: ViewEntityOptions = {}): Function {
    return function (target: Function) {
        let tableName = target.name.replace(/([A-Z]|[0-9]+)/g, (str) => "_" + str.toLowerCase()).substr(1);
        options.name = tableName;
        TypeOrmViewEntity(options)(target);
    };
}
