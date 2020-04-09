import { PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../BaseEntity";
import {Column,Entity} from "../decorator";

@Entity()
export class BcUser extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    loginName: string;

    @Column()
    loginPassword: string;

    @Column()
    pic: string;

    @Column()
    bussWx: string;
}
