import {Subscription} from "egg";
import {getCustomRepository} from "typeorm";
import BdStatBillMRepo from "../database/repositories/BdStatBillMRepo";

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
            await getCustomRepository(BdStatBillMRepo).generate();
            this.app.loggers.logger.info("[schedule]", "BdStatBillM generate success");
        }catch (e) {
            this.app.loggers.logger.info("[schedule]", "BdStatBillM generate error "+e.message);
            throw e;
        }
    }
}