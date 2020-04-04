import {BeforeInsert, Column, Entity} from "typeorm";
import Assert from "../../utils/Assert";
import {DateTimeColumn} from "../annotation/DateTimeColumn";
import {BaseEntity} from "../BaseEntity";

@Entity()
export class BdBill extends BaseEntity {
    @Column({name: "money", type: "double"})
    money: number;

    @Column({name: "bill_desc"})
    billDesc: string;

    @DateTimeColumn({name: "date_time"})
    dateTime: Date;

    @Column({name: "bill_type_id", length: 36})
    billTypeId: string | null;

    @Column({name: "user_id", length: 36})
    userId: string | null;

    @Column({name: "card_id", length: 36})
    cardId: string | null;

    @Column({name: "target_card_id", length: 36, nullable: true})
    targetCardId: string;

    @BeforeInsert()
    validField() {
        Assert.hasText(this.billDesc, "备注为空");
        Assert.hasText(this.billTypeId, "账单类型为空");
        Assert.hasText(this.userId, "用户为空");
        Assert.isTrue(!!this.dateTime, "时间为空");
        Assert.isTrue(this.money !== 0, "金额为0");
    }
}
