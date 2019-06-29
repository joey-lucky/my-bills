import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import BaseEntity from "../BaseEntity";
import {BcUser} from "./BcUser";
import {BcCardType} from "./BcCardType";

@Entity()
export class BcCard extends BaseEntity {
    @Column({name: "name"})
    name: string;

    @Column({name: "balance"})
    balance: number;

    @Column({name: "user_id",length:36,nullable:true})
    userId: string|null;

    @Column({name: "card_type_id",length:36,nullable:true})
    cardTypeId: string|null;

    @ManyToOne(() => BcUser, {onDelete: "SET NULL", onUpdate: "CASCADE"})
    @JoinColumn({name: "user_id",})
    user: BcUser;

    @ManyToOne(() => BcCardType, {onDelete: "SET NULL", onUpdate: "CASCADE"})
    @JoinColumn({name: "card_type_id"})
    cardType: BcCardType;
}
