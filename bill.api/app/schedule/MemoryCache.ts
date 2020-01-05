import {Subscription} from "egg";
import {initAllCache} from "../database/cache";

export default class CalculateBalance extends Subscription {
    static get schedule() {
        return {
            interval: "60s", // 60 分钟间隔
            type: "all", // 指定所有的 worker 都需要执行
            immediate: true
        };
    }

    async subscribe() {
        try{
            await initAllCache();
            this.app.loggers.logger.info("[schedule]", "MemoryCache success");
        }catch (e) {
            this.app.loggers.logger.info("[schedule]", "MemoryCache error "+e.message);
            throw e;
        }
    }
}