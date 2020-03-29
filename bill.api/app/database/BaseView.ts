import * as orm from "typeorm";
import {AfterLoad} from "typeorm";
import {translate} from "./translate";

export class BaseView extends orm.BaseEntity {
    @AfterLoad()
    async translateColumn(){
        await translate(this);
    }
}
