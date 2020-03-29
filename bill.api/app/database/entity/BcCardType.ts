import {Column, Entity} from "typeorm";
import {BaseEntity} from "../BaseEntity";
import {MemoryCache} from "../cache";
import {TranslateSource} from "../translate";

@MemoryCache({expires: 60 * 60 * 1000})
@TranslateSource("cardTypeId")
@Entity()
export class BcCardType extends BaseEntity {
    @Column({name: "name"})
    name: string;
}
