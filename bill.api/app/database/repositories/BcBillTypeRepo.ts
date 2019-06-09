import {EntityRepository, FindConditions} from "typeorm";
import BaseRepository from "../BaseRepository";
import {BcBillType} from "../entity/BcBillType";

@EntityRepository(BcBillType)
export default class BcBillTypeRepo extends BaseRepository<BcBillType> {

    /**
     * 消费类账单
     */
    async getConsumerList(): Promise<BcBillType[]> {
        return await this.find({where: {type: "-1"}});
    }
}