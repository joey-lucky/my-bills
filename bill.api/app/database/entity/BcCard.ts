import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {BaseEntity} from "../BaseEntity";
import {MemoryCache} from "../cache";
import {TranslateColumn, TranslateSource} from "../translate";
import {BcCardType} from "./BcCardType";
import {BcUser} from "./BcUser";

@MemoryCache({expires: 60 * 60 * 1000})
@TranslateSource("cardId")
@Entity()
export class BcCard extends BaseEntity {
    @Column({name: "name"})
    name: string;

    @Column({name: "balance", type: "double"})
    balance: number;

    @Column({name: "user_id", length: 36})
    userId: string | null;

    @Column({name: "card_type_id", length: 36})
    cardTypeId: string | null;

    @TranslateColumn({foreignKey: "userId"})
    userName: string;

    @TranslateColumn({foreignKey: "cardTypeId"})
    cardTypeName: string;
}
