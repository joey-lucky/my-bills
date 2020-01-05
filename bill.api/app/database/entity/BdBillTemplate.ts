import {Column, Entity} from "typeorm";
import {BaseEntity} from "../BaseEntity";
import {BcUser} from "./BcUser";
import {BcCard} from "./BcCard";
import {TranslateColumn} from "../translate";
import {findOneWithCache} from "../cache";

@Entity()
export class BdBillTemplate extends BaseEntity {
    @Column({name: "name"})
    name: string;

    @Column({name: "bill_desc"})
    billDesc: string;

    @Column({name: "bill_type_id", length: 36})
    billTypeId: string | null;

    @Column({name: "user_id", length: 36})
    userId: string | null;

    @Column({name: "card_id", length: 36})
    cardId: string | null;

    @Column({name: "target_card_id", length: 36,nullable:true})
    targetCardId: string | null;

    @TranslateColumn({
        foreignKey: "userId",
    })
    userName:string;

    @TranslateColumn({
        foreignKey: "billTypeId",
    })
    billTypeName:string;

    @TranslateColumn({
        foreignKey: "cardId",
    })
    cardName:string;

    @TranslateColumn({
        foreignKey: "cardId",
        getSourceValue: (entity: BcCard) => entity.userId
    })
    cardUserId: string;

    @TranslateColumn({
        foreignKey: "cardId",
        getSourceValue: async (entity: BcCard) => {
            let user = await findOneWithCache(BcUser, entity.userId);
            return user.name;
        }
    })
    cardUserName: string;

    @TranslateColumn({
        foreignKey: "targetCardId",
        target:BcCard,
    })
    targetCardName:string;

    @TranslateColumn({
        foreignKey: "targetCardId",
        target:BcCard,
        getSourceValue: (entity: BcCard) => entity.userId
    })
    targetCardUserId: string;

    @TranslateColumn({
        foreignKey: "targetCardId",
        target:BcCard,
        getSourceValue: async (entity: BcCard) => {
            let user = await findOneWithCache(BcUser, entity.userId);
            return user.name;
        }
    })
    targetCardUserName: string;
}