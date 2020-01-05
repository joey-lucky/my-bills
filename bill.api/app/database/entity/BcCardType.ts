import {Column, Entity} from "typeorm";
import {BaseEntity} from "../BaseEntity";
import {TranslateSource} from "../translate";
import {MemoryCache} from "../cache";

@MemoryCache({expires:60*60*1000})
@TranslateSource("cardTypeId")
@Entity()
export class BcCardType extends BaseEntity {
    @Column({name:"name"})
    name: string;
}
