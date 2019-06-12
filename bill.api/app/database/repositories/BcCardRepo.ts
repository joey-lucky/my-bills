import {EntityRepository, FindConditions, FindOneOptions, FindOperator, getRepository, ObjectID} from "typeorm";
import BaseRepository from "../BaseRepository";
import {BcCard} from "../entity/BcCard";
import {BcCardType} from "../entity/BcCardType";
import {BcUser} from "../entity/BcUser";

interface QueryParams {
    searchText?: string;
    name?: string;
    userId?: string;
    cardTypeId?: string;
    balance?: number;
}

export interface BcCardView {
    id:string;
    name: string;
    userName: string;
    cardTypeName: string;
    balance: number;
}

@EntityRepository(BcCard)
export default class BcCardRepo extends BaseRepository<BcCard> {
    /**
     * 消费类账单
     */
    async getViewList(params: QueryParams = {}): Promise<BcCardView[]> {
        let conditions: FindConditions<BcCard>[] = [];
        if (params.userId) {
            conditions.push({
                userId: params.userId
            });
        }
        if (params.cardTypeId) {
            conditions.push({cardTypeId: params.cardTypeId});
        }
        if (params.name) {
            conditions.push({name: params.name});
        }
        if (params.balance) {
            conditions.push({balance: params.balance});
        }
        if (params.searchText) {
            conditions.push({name: new FindOperator("like","%"+params.searchText+"%")});
        }
        let data:BcCard[] = await this.find({where: conditions});
        return this.entityToViewList(data);
    }

    async findViewOne(id?: string , options?: FindOneOptions<BcCard>){
        let entity: BcCard = await this.findOne(id, options);
        return this.entityToView(entity);
    }

    async entityToView(entity:BcCard):Promise<BcCardView>{
        let view = {
            id: entity.id,
            name: entity.name,
            balance: entity.balance,
            cardTypeName: "",
            userName: "",
        };
        if (entity.cardType === null) {
            let childEntity = await getRepository(BcCardType).findOne(entity.cardTypeId);
            view.cardTypeName = childEntity.name;
        }
        if (entity.user === null) {
            let childEntity = await getRepository(BcUser).findOne(entity.userId);
            view.userName = childEntity.name;
        }
        return view;
    }

    async entityToViewList(entities:BcCard[]):Promise<BcCardView[]>{
        let views: BcCardView[] = [];
        for (let entity of entities) {
            views.push(await this.entityToView(entity));
        }
        return views;
    }
}