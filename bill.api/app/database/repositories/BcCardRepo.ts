import {EntityRepository, FindConditions, FindOperator} from "typeorm";
import BaseRepository from "../BaseRepository";
import {BcCard} from "../entity/BcCard";
import {BdBill} from "../entity/BdBill";

interface QueryParams {
    searchText?: string;
    name?: string;
    userId?: string;
    cardTypeId?: string;
    balance?: number;
}

@EntityRepository(BcCard)
export default class BcCardRepo extends BaseRepository<BcCard> {
    /**
     * 消费类账单
     */
    async getList(params: QueryParams = {}): Promise<BcCard[]> {
        let conditions: FindConditions<BcCard>[] = [];
        if (params.userId) {
            conditions.push({userId: params.userId});
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
        return await this.find({where:conditions});
    }
}