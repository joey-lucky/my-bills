import {AfterLoad, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../BaseEntity";
import {MemoryCache} from "../cache";
import {TranslateSource} from "../translate";

@MemoryCache({expires: 60 * 1000})
@TranslateSource("userId")
@Entity()
export class BcUser extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({name: "name"})
    name: string;

    @Column({name: "login_name"})
    loginName: string;

    @Column({name: "login_password"})
    loginPassword: string;

    @Column({name: "pic"})
    pic: string;

    @Column({name: "buss_wx"})
    bussWX: string;

    @AfterLoad()
    deletePassword(): void {
        delete this.loginPassword;
        delete this.loginName;
    }
}
