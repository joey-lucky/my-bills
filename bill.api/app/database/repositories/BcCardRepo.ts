import {EntityRepository, FindConditions, FindOneOptions, FindOperator, getRepository} from "typeorm";
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
    id: string;
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
    public async getViewList(params: QueryParams = {}): Promise<BcCardView[]> {
        let conditions: FindConditions<BcCard>[] = [];
        if (params.userId) {
            conditions.push({
                user: await getRepository(BcUser).findOne(params.userId)
            });
        }
        if (params.cardTypeId) {
            conditions.push({cardType: await getRepository(BcCardType).findOne(params.cardTypeId)});
        }
        if (params.name) {
            conditions.push({name: params.name});
        }
        if (params.balance) {
            conditions.push({balance: params.balance});
        }
        if (params.searchText) {
            conditions.push({name: new FindOperator("like", "%" + params.searchText + "%")});
        }
        let data: BcCard[] = await this.find({
            where: conditions,
            relations: ["cardType", "user"],
            order:{
                name:"ASC"
            }
        });
        return this.entityToViewList(data);
    }

    private  async findViewOne(id?: string, options?: FindOneOptions<BcCard>) {
        let entity: BcCard = await this.findOne(id, options);
        return this.entityToView(entity);
    }

    private async entityToView(entity: BcCard): Promise<BcCardView> {
        let view = {
            id: entity.id,
            name: entity.name,
            balance: entity.balance,
            cardTypeName: "",
            userName: "",
        };
        let cardType = entity.cardType;
        let user = entity.user;
        view.cardTypeName = cardType.name;
        view.userName = user.name;
        return view;
    }

    private  async entityToViewList(entities: BcCard[]): Promise<BcCardView[]> {
        let views: BcCardView[] = [];
        for (let entity of entities) {
            views.push(await this.entityToView(entity));
        }
        return views;
    }
}