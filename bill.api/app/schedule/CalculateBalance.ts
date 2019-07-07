import {Subscription} from "egg";
import {getCustomRepository} from "typeorm";
import BcCardRepo from "../database/repositories/BcCardRepo";

export default class CalculateBalance extends Subscription {
    static get schedule() {
        return {
            interval: "60s", // 60 分钟间隔
            type: "all", // 指定所有的 worker 都需要执行
            immediate: false
        };
    }

    async subscribe() {
        try{
            await getCustomRepository(BcCardRepo).calculateBalance();
            this.app.loggers.logger.info("[schedule]", "card balance calculate success");
        }catch (e) {
            this.app.loggers.logger.info("[schedule]", "card balance calculate error "+e.message);
            throw e;
        }
    }
}