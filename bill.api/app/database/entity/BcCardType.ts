import {Column,Entity} from "../decorator";
import {BaseEntity} from "../BaseEntity";

@Entity()
export class BcCardType extends BaseEntity {
    @Column()
    name: string;
}
