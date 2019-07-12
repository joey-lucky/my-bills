import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import BaseEntity from "../BaseEntity";
import {BcBillType} from "./BcBillType";
import {BcUser} from "./BcUser";
import {BcCard} from "./BcCard";


@Entity()
export class BdBillTemplate extends BaseEntity {
    @Column({name: "bill_desc"})
    billDesc: string;

    @Column({name: "bill_type_id", length: 36})
    billTypeId: string | null;

    @Column({name: "user_id", length: 36})
    userId: string | null;

    @Column({name: "card_id", length: 36})
    cardId: string | null;

    @ManyToOne(() => BcBillType, {onDelete: "NO ACTION", onUpdate: "CASCADE"})
    @JoinColumn({name: "bill_type_id"})
    billType: BcBillType;

    @ManyToOne(() => BcUser, {onDelete: "NO ACTION", onUpdate: "CASCADE"})
    @JoinColumn({name: "user_id"})
    user: BcUser;

    @ManyToOne(() => BcCard, {onDelete: "NO ACTION", onUpdate: "CASCADE"})
    @JoinColumn({name: "card_id"})
    card: BcCard;

    private static entityToView(entity: BdBillTemplate): BdBillTemplateView {
        let userName =
            entity.user &&
            entity.user.name || "";
        let billTypeName =
            entity.billType &&
            entity.billType.name || "";
        let cardName =
            entity.card &&
            entity.card.name || "";
        let cardUserName =
            entity.card &&
            entity.card.user &&
            entity.card.user.name || "";
        let cloneEntity = {...entity};
        delete cloneEntity.user;
        delete cloneEntity.billType;
        delete cloneEntity.card;
        return {
            ...cloneEntity,
            userName,
            billTypeName,
            cardName,
            cardUserName,
        };
    }

    private static entityToViews(entities: BdBillTemplate[]): BdBillTemplateView[] {
        return entities.map(item =>
            this.entityToView(item)
        );
    }

    public static async getViewList({userId}):Promise<BdBillTemplateView[]>{
        let where:any = {};
        if (userId) {
            where.userId = userId;
        }
       let data  = await this.find({
            where:where,
            relations:[
                "card",
                "card.user",
                "user",
                "billType",
            ]
        });
        return this.entityToViews(data);
    }
}

export interface BdBillTemplateView {
    id: string,
    billTypeId: string;
    userId: string;
    cardId: string;
    billDesc: string,
    cardName: string,
    userName: string,
    billTypeName: string,
    cardUserName: string,
}