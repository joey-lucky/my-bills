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

    @ManyToOne(() => BcUser, {onDelete: "SET NULL", onUpdate: "CASCADE"})
    @JoinColumn({name: "user_id"})
    user: BcUser;

    @ManyToOne(() => BcCardType, {onDelete: "SET NULL", onUpdate: "CASCADE"})
    @JoinColumn({name: "card_type_id"})
    cardType: BcCardType;
}
