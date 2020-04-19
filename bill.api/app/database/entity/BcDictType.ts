import {Column, Entity} from "../decorator";
import {BaseEntity} from "../BaseEntity";

@Entity()
export class BcDictType extends BaseEntity {
    @Column()
    code: string;

    @Column()
    value: string;
}
