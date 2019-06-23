import {Subscription} from "egg";
import {getConnection, getCustomRepository} from "typeorm";
import BcCardRepo from "../database/repositories/BcCardRepo";

/**
 * 计算余额
 */
export default class extends Subscription {
    static get schedule() {
        return {
            interval: "30s", // 60 分钟间隔
            type: "all", // 指定所有的 worker 都需要执行
            immediate: true,
        };
    }

    async subscribe() {
        let billMoneyMap: Map<string, number> = await this.getBillMoneyStatMap();
        let transferBillMoneyMap: Map<string, number> = await this.getTransferBillMoneyStatMap();
        let data = await getCustomRepository(BcCardRepo).find();
        for (let item of data) {
            let billMoney = billMoneyMap.get(item.id)||0;
            let transferMoney = transferBillMoneyMap.get(item.id) || 0;
            item.balance = billMoney + transferMoney;
        }
        await getCustomRepository(BcCardRepo).save(data);
        this.app.loggers.logger.info("[schedule]", "card balance refresh");
    }

    private async getBillMoneyStatMap(): Promise<Map<string, number>> {
        let data = await getConnection().query("select bb.card_id,sum(bb.money) money\n" +
            "    from bd_bill bb\n" +
            "    group by  bb.card_id");
        let map: Map<string, number> = new Map<string, number>();
        for (let item of data) {
            map.set(item["card_id"], item.money);
        }
        return map;
    }

    private async getTransferBillMoneyStatMap(): Promise<Map<string, number>> {
        let data = await getConnection().query("select t.target_card_id,\n" +
            "       sum(t1.money) as money\n" +
            "from bd_bill_transfer t\n" +
            "       left join bd_bill t1 on t1.id = t.bill_id\n" +
            "group by t.target_card_id");
        let map: Map<string, number> = new Map<string, number>();
        for (let item of data) {
            map.set(item["target_card_id"], 0 - item.money);
        }
        return map;
    }
}