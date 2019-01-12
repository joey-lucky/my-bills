import {Subscription} from 'egg';

export default class extends Subscription {
    static get schedule() {
        return {
            interval: '1m', // 1 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
            immediate: true,
        };
    }

    async subscribe() {
       console.log("subscribe")
    }

}