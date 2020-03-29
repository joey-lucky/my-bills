import {Column, Entity} from "typeorm";
import {BaseEntity} from "../BaseEntity";
import {MemoryCache} from "../cache";
import {TranslateSource} from "../translate";

@MemoryCache({expires: 60 * 60 * 1000})
@TranslateSource("billTypeId")
@Entity()
export class BcBillType extends BaseEntity {
    @Column({name: "name"})
    name: string;

    @Column({name: "sort"})
    sort: number;

    @Column({name: "type", comment: "-1支出 1收入 0转账"})
    type: string;

    get typeName(){
        if (this.type === "-1") {
            return "支出";
        } else if (this.type === "1") {
            return "收入";
        } else {
            return "其它";
        }
    }
}
