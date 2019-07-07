import {Column, Entity, getConnection, JoinColumn, ManyToOne} from "typeorm";
import BaseEntity from "../BaseEntity";
import {BcUser} from "./BcUser";
import * as moment from "moment";

@Entity()
export class BdStatBillM extends BaseEntity {
    @Column({
        name: "date_time",
        type: "datetime",
        transformer: {
            from: (date: Date) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
            to: (date: string) => moment(date).toDate(),
        },
        comment: "月份"
    })
    dateTime: string;

    @Column({name: "income", type: "double", comment: "收入"})
    income: number;

    @Column({name: "outgoing", type: "double", comment: "支出"})
    outgoing: number;

    @Column({name: "surplus", type: "double", comment: "结余"})
    surplus: number;

    @Column({name: "user_id", length: 36, comment: "用户id"})
    userId: string;

    @ManyToOne(() => BcUser, {onDelete: "NO ACTION", onUpdate: "CASCADE"})
    @JoinColumn({name: "user_id"})
    user: BcUser;

}
