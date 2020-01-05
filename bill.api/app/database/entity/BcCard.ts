import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {BaseEntity} from "../BaseEntity";
import {BcUser} from "./BcUser";
import {BcCardType} from "./BcCardType";
import {TranslateColumn, TranslateSource} from "../translate";
import {MemoryCache} from "../cache";

@MemoryCache({expires:60*60*1000})
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

    @ManyToOne(() => BcUser, {onDelete: "NO ACTION", onUpdate: "CASCADE"})
    @JoinColumn({name: "user_id",})
    user: BcUser;

    @ManyToOne(() => BcCardType, {onDelete: "NO ACTION", onUpdate: "CASCADE"})
    @JoinColumn({name: "card_type_id"})
    cardType: BcCardType;

    @TranslateColumn({foreignKey:"userId"})
    userName: string;

    @TranslateColumn({foreignKey:"cardTypeId"})
    cardTypeName: string;
}
