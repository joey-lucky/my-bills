import {DateTimeColumn} from "../decorator";
import {BaseEntity} from "../BaseEntity";
import {Column,Entity} from "../decorator";

@Entity()
export class BdSendMessage extends BaseEntity {
    @Column()
    userId: string;

    @Column()
    sendStatus: string;

    @Column({ length: 2000})
    msgContent: string;

    @Column({nullable: true})
    errorCode: string;

    @DateTimeColumn()
    sendTime: string|Date;

    @Column()
    tokenId: string;
}