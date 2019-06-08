import {Application} from "egg";
import SqlStringUtils from "../../utils/SqlStringUtils";

export default class CalculateBalance {
    readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public async calculate(cardIds?: string[]) {
        const cardOfMoney = await this.getCardOfMoney(cardIds);
        const transferCardOfMoney = await this.getTransferCardOfMoney(cardIds);
        const cardList: any[] = await this.getCardList(cardIds);
        for (const card of cardList) {
            const id = card.id;
            const money = cardOfMoney.get(id) || 0;
            const transferMoney = transferCardOfMoney.get(id) || 0;
            card.balance = Number(Number(money + (0 - transferMoney)).toFixed(2));
            await this.app.sqlExecutor.update("bc_card", card);
        }
    }

    private async getCardOfMoney(cardIds?: string[]): Promise<Map<string, number>> {
        let sql = "select t.card_id,\n" +
            "       sum(t.money) as money\n" +
            "from bd_bill t\n" +
            "where 1 = 1\n";
        const queryParams: string[] = [];
        if (cardIds && cardIds.length > 0) {
            queryParams.push(...cardIds);
            sql += ` and t.card_id in (${SqlStringUtils.getNumOfQuestionMark(cardIds.length)})\n`;
        }
        sql += "group by t.card_id";
        const data = await this.app.sqlExecutor.query(sql, queryParams);
        const result: Map<string, number> = new Map<string, number>();
        for (const item of data) {
            const cardId = item["card_id"];
            const money = item["money"];
            result.set(cardId, money);
        }
        return result;
    }

    private async getTransferCardOfMoney(cardIds?: string[]): Promise<Map<string, number>> {
        let sql = "select sum(t1.money) as money,\n" +
            "       t.target_card_id\n" +
            "from bd_bill_transfer t\n" +
            "            left join bd_bill t1 on t1.id = t.bill_id\n" +
            "where 1 = 1\n";
        const queryParams: string[] = [];
        if (cardIds && cardIds.length > 0) {
            queryParams.push(...cardIds);
            sql += ` and t.target_card_id in (${SqlStringUtils.getNumOfQuestionMark(cardIds.length)})\n`;
        }
        sql += "group by t.target_card_id";
        const data = await this.app.sqlExecutor.query(sql, queryParams);
        const result: Map<string, number> = new Map<string, number>();
        for (const item of data) {
            const cardId = item["target_card_id"];
            const money = item["money"];
            result.set(cardId, money);
        }
        return result;
    }

    private async getCardList(cardIds?: string[]): Promise<any[]> {
        let sql = "select *\n" +
            "from bc_card t\n" +
            "where 1 = 1\n";
        const queryParams: string[] = [];
        if (cardIds && cardIds.length > 0) {
            queryParams.push(...cardIds);
            sql += ` and t.id in (${SqlStringUtils.getNumOfQuestionMark(cardIds.length)})\n`;
        }
        return await this.app.sqlExecutor.query(sql, queryParams);
    }
}
