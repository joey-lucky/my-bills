import {Column, Entity, FindConditions, FindOperator, getRepository, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import BaseEntity from "../BaseEntity";
import {BcUser} from "./BcUser";
import {BcBillType} from "./BcBillType";
import {BcCard} from "./BcCard";
import {BdBillTransfer} from "./BdBillTransfer";

interface PageInfo {
    pageIndex: number,
    pageSize: number,
}

interface QueryParam {
    userId?: string,
    cardId?: string,
    billTypeId?: string,
    dateTime?: [Date, Date]
}

@Entity()
export class BdBill extends BaseEntity {
    @Column({name: "card_id"})
    cardId: string;

    @Column({name: "user_id"})
    userId: string;

    @Column({name: "bill_type_id"})
    billTypeId: string;

    @Column({name: "money"})
    money: number;

    @Column({name: "bill_desc"})
    billDesc: string;

    @Column({name: "date_time"})
    dateTime: Date;

    @ManyToOne(type => BcCard)
    @JoinColumn({name: "card_id"})
    card: BcCard;

    @ManyToOne(type => BcUser)
    @JoinColumn({name: "user_id"})
    user: BcUser;

    @ManyToOne(type => BcBillType)
    @JoinColumn({name: "bill_type_id"})
    billType: BcBillType;

    @OneToOne(type => BdBillTransfer, (transfer) => transfer.bill)
    billTransfer: BdBillTransfer | null;

    userName: string | undefined;
    cardName: string | undefined;
    billTypeName: string | undefined;

    static async getPageData(pageInfo: PageInfo, params: QueryParam) {
        let {pageIndex, pageSize} = pageInfo;
        let {userId, cardId, billTypeId, dateTime} = params;
        const start = (pageSize * (pageIndex - 1));
        let whereStr = "1=1 ";
        let condition: FindConditions<BdBill> = {};
        let conditions: FindOperator<BdBill>[] = [];

        if (userId) {
            condition.userId = userId;
        }
        if (cardId) {
            condition.cardId = cardId;
        }
        if (billTypeId) {
            condition.billTypeId = billTypeId;
        }
        if (dateTime) {
            if (dateTime[0]) {
            }
        }
        let data = await getRepository(BdBill).findAndCount({
            relations: ["card", "user", "billType", "billTransfer"],
            skip: start,
            take: pageSize,
            where: condition
        });
        return data;

    }
}
