import {Column, Entity} from "typeorm";
import {DateTimeColumn} from "../annotation/DateTimeColumn";
import {BaseEntity} from "../BaseEntity";

@Entity()
export class BcToken extends BaseEntity {
    @Column({name: "type", length: 36})
    type: string;

    @Column({name: "agent_id", type: "int"})
    agentId: number;

    @Column({name: "secret", length: 255})
    secret: string;

    @Column({name: "corp_id", length: 255})
    corpId: string;

    @Column({name: "access_token", length: 255})
    accessToken: string;

    @DateTimeColumn({name: "expires_in"})
    expiresIn: Date;
}
