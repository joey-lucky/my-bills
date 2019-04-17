import {Subscription} from 'egg';

/**
 * 计算余额
 */
export default class extends Subscription {
    static get schedule() {
        return {
            interval: '60m', // 60 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
            immediate: true,
        };
    }

    async subscribe() {
        await this.app.calculateBalance.calculate();
        this.app.loggers.logger.info("[schedule]", "card balance refresh");
    }
}