import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import BaseEntity from "../BaseEntity";
import {BcBillType} from "./BcBillType";
import {BcUser} from "./BcUser";
import {BcCard} from "./BcCard";


@Entity()
export class BdBillTemplate extends BaseEntity {
    @Column({name: "name"})
    name: string;

    @Column({name: "bill_desc"})
    billDesc: string;

    @Column({name: "bill_type_id", length: 36})
    billTypeId: string | null;

    @Column({name: "user_id", length: 36})
    userId: string | null;

    @Column({name: "card_id", length: 36})
    cardId: string | null;

    @Column({name: "target_card_id", length: 36,nullable:true})
    targetCardId: string | null;

    @ManyToOne(() => BcBillType, {onDelete: "NO ACTION", onUpdate: "CASCADE"})
    @JoinColumn({name: "bill_type_id"})
    billType: BcBillType;

    @ManyToOne(() => BcUser, {onDelete: "NO ACTION", onUpdate: "CASCADE"})
    @JoinColumn({name: "user_id"})
    user: BcUser;

    @ManyToOne(() => BcCard, {onDelete: "NO ACTION", onUpdate: "CASCADE"})
    @JoinColumn({name: "card_id"})
    card: BcCard;

    @ManyToOne(() => BcCard, {onDelete: "NO ACTION", onUpdate: "CASCADE"})
    @JoinColumn({name: "target_card_id"})
    targetCard: BcCard;

    private static entityToView(entity: BdBillTemplate): BdBillTemplateView {
        let userName =
            entity.user &&
            entity.user.name || "";
        let billTypeName =
            entity.billType &&
            entity.billType.name || "";
        let billTypeType =
            entity.billType &&
            entity.billType.type || "";
        let billTypeTypeName =
            entity.billType &&
            entity.billType.typeName || "";
        let cardName =
            entity.card &&
            entity.card.name || "";
        let cardUserName =
            entity.card &&
            entity.card.user &&
            entity.card.user.name || "";
        let targetCardName =
            entity.targetCard &&
            entity.targetCard.name || "";
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
            targetCardName,
            billTypeType,
            billTypeTypeName
        };
    }

    private static entityToViews(entities: BdBillTemplate[]): BdBillTemplateView[] {
        return entities.map(item =>
            this.entityToView(item)
        );
    }

    public static async getViewList(params?: { userId?: string }): Promise<BdBillTemplateView[]> {
        let where: any = {};
        if (params && params.userId) {
            where.userId = params.userId;
        }
        let data = await this.find({
            where: where,
            relations: [
                "card",
                "targetCard",
                "card.user",
                "user",
                "billType",
            ]
        });
        let views = this.entityToViews(data);
        views = views.sort((a, b) => {
            return Number.parseInt(a.billTypeType) - Number.parseInt(b.billTypeType);
        });
        return views;
    }
}

export interface BdBillTemplateView {
    id: string,
    name: string,
    billTypeId: string;
    userId: string;
    cardId: string;
    targetCardId: string;
    billDesc: string,
    cardName: string,
    userName: string,
    billTypeName: string,
    billTypeTypeName: string,
    billTypeType: string,
    cardUserName: string,
    targetCardName: string,
}