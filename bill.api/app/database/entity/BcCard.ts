import {Column, Entity, ManyToOne} from "typeorm";
import BaseEntity from "../BaseEntity";
import {BcUser} from "./BcUser";
import {BcCardType} from "./BcCardType";

@Entity()
export class BcCard extends BaseEntity {
    @Column({name:"name"})
    name: string;

    @Column({name:"user_id"})
    userId: string;

    @Column({name:"card_type_id"})
    cardTypeId: string;

    @Column({name:"balance"})
    balance: number;

    @ManyToOne(type => BcUser)
    user: BcUser;

    @ManyToOne(type => BcCardType)
    cardType: BcCardType;

    userName: string | undefined;
    cardTypeName: string | undefined;
}
