import {BeforeInsert, Column, Entity} from "typeorm";
import {BaseEntity} from "../BaseEntity";
import {BcUser} from "./BcUser";
import {BcCard} from "./BcCard";
import Assert from "../../utils/Assert";
import {TranslateColumn} from "../translate";
import {DateTimeColumn} from "../annotation/DateTimeColumn";
import {findOne} from "../DataBaseUtil";
import {findOneWithCache} from "../cache";
import {BcBillType} from "./BcBillType";

@Entity()
export class BdBill extends BaseEntity {
    @Column({name: "money", type: "double"})
    money: number;

    @Column({name: "bill_desc"})
    billDesc: string;

    @DateTimeColumn({name:"date_time"})
    dateTime: Date;

    @Column({name: "bill_type_id", length: 36})
    billTypeId: string | null;

    @Column({name: "user_id", length: 36})
    userId: string | null;

    @Column({name: "card_id", length: 36})
    cardId: string | null;

    @Column({name: "target_card_id", length: 36, nullable: true})
    targetCardId: string;

    @TranslateColumn({
        foreignKey: "userId",
    })
    userName: string;

    @TranslateColumn({
        foreignKey: "billTypeId",
    })
    billTypeName: string;

    @TranslateColumn({
        foreignKey: "cardId",
    })
    cardName: string;

    @TranslateColumn({
        foreignKey: "cardId",
        getSourceValue: (entity: BcCard) => entity.userId
    })
    cardUserId: string;

    @TranslateColumn({
        foreignKey: "cardId",
        getSourceValue: async (entity: BcCard) => {
            let user = await findOne(BcUser, entity.userId);
            return user.name;
        }
    })
    cardUserName: string;

    @TranslateColumn({
        foreignKey: "targetCardId",
        target: BcCard,
    })
    targetCardName: string;

    @TranslateColumn({
        foreignKey: "targetCardId",
        target: BcCard,
        getSourceValue: (entity: BcCard) => entity.userId
    })
    targetCardUserId: string;

    @TranslateColumn({
        foreignKey: "targetCardId",
        target: BcCard,
        getSourceValue: async (entity: BcCard) => {
            let user = await findOneWithCache(BcUser, entity.userId);
            return user.name;
        }
    })
    targetCardUserName: string;

    @TranslateColumn({
        foreignKey: "billTypeId",
        getSourceValue:(entity:BcBillType)=>entity.typeName
    })
    billTypeTypeName: string;

    @BeforeInsert()
    validField() {
        Assert.hasText(this.billDesc, "备注为空");
        Assert.hasText(this.billTypeId, "账单类型为空");
        Assert.hasText(this.userId, "用户为空");
        Assert.isTrue(!!this.dateTime, "时间为空");
        Assert.isTrue(this.money !== 0, "金额为0");
    }
}
