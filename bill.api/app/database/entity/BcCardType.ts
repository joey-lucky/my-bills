import {Column, Entity} from "typeorm";
import {BaseEntity} from "../BaseEntity";

@Entity()
export class BcCardType extends BaseEntity {
    @Column({name: "name"})
    name: string;
}
