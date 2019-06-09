import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import BaseEntity from "../BaseEntity";
import {BcUser} from "./BcUser";
import {BcCardType} from "./BcCardType";

@Entity()
export class BcCard extends BaseEntity {
    @Column({name: "name"})
    name: string;

    @Column({name: "user_id"})
    userId: string;

    @Column({name: "card_type_id"})
    cardTypeId: string;

    @Column({name: "balance"})
    balance: number;

    @ManyToOne(type => BcUser)
    @JoinColumn({name: "user_id"})
    user: BcUser;

    @ManyToOne(type => BcCardType)
    @JoinColumn({name: "card_type_id"})
    cardType: BcCardType;

    userName: string | undefined;
    cardTypeName: string | undefined;
}
