import {Column, Entity} from "typeorm";
import BaseEntity from "../BaseEntity";

@Entity()
export class BcUser extends BaseEntity {
    @Column({name:"name"})
    name: string;

    @Column({name:"login_name"})
    loginName: string;

    @Column({name:"login_password"})
    loginPassword: string;

    @Column({name:"pic"})
    pic: string;
}
