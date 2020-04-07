import * as orm from "typeorm";
import {PrimaryColumn} from "typeorm";

export class BaseView extends orm.BaseEntity {
    @PrimaryColumn({name: "id"})
    id: string;
}
