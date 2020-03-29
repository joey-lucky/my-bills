import {Column, Entity} from "typeorm";
import {DateTimeColumn} from "../annotation/DateTimeColumn";
import {BaseEntity} from "../BaseEntity";

@Entity()
export class BdSendMessage extends BaseEntity {
    @Column({name: "user_id"})
    userId: string;

    @Column({name: "send_status"})
    sendStatus: string;

    @Column({name: "msg_content", length: 2000})
    msgContent: string;

    @Column({name: "error_code", nullable: true})
    errorCode: string;

    @DateTimeColumn({name: "send_time"})
    sendTime: Date;

    @Column({name: "token_id"})
    tokenId: string;
}