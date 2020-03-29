import {Application} from "egg";
import {FindConditions} from "typeorm";
import {BcCard, BcUser, find} from "../../database";
import {BaseService} from "../BaseService";

export default class BcCardService extends BaseService {
    public async groupByUser() {
        type GroupByUserCardView = {
            userName: string;
            children: BcCard[]
        };
        const list = await this.getList();
        const map: { [key: string]: GroupByUserCardView; } = {};
        for (const item of list) {
            const userName = item.userName;
            if (!map[userName]) {
                map[userName] = {
                    userName,
                    children: [],
                };
            }
            map[userName].children.push(item);
        }
        return Object.values(map);
    }

    public async getList() {
        return await find(BcCard, {where: this.toFindConditions(), order: {userId: "DESC"}});
    }

    public async getAssetList() {
        type Asset = { pic?: string } & BcCard;
        const list: Asset[] = await this.getList();
        const userList: BcUser[] = await find(BcUser, {});
        const userMap = userList.reduce((pre, curr) => {
            pre[curr.id] = curr;
            return pre;
        }, {});
        for (const item of list) {
            item.pic = userMap[item.userId].pic;
        }
        return list;
    }

    public async groupByType() {
        type CardType = { cardTypeName: string, balance: number, children: BcCard[] };
        const data = await this.getList();
        const cardTypeMap: { [key: string]: CardType } = {};
        for (const item of data) {
            const cardTypeName = item.cardTypeName;
            const balance = item.balance || 0;
            if (!cardTypeMap[cardTypeName]) {
                cardTypeMap[cardTypeName] = {
                    cardTypeName,
                    balance: 0,
                    children: [],
                };
            }
            cardTypeMap[cardTypeName].balance += balance;
            cardTypeMap[cardTypeName].children.push(item);
        }
        return Object.values(cardTypeMap);
    }

    public async getListByCardTypeId(cardTypeId?: string | string[]): Promise<any[]> {
        const app: Application = this.app;
        let sql = "select *\n" +
            "from bc_card t\n" +
            "where 1=1\n";
        const queryParams: string[] = [];
        if (cardTypeId) {
            if (typeof cardTypeId === "string") {
                sql += "  and t.card_type_id = ?\n";
                queryParams.push(cardTypeId);
            } else if (Array.isArray(cardTypeId) && cardTypeId.length > 0) {
                let idSql = "";
                for (const id of cardTypeId) {
                    idSql += "?,";
                    queryParams.push(id);
                }
                idSql = idSql.substr(0, idSql.length - 1);
                sql += `  and t.card_type_id in (${idSql})\n`;
            }
        }
        sql += "order by t.user_id asc,t.card_type_id asc,t.name asc";
        const rows: any[] = await app.sqlExecutor.query(sql, queryParams);
        for (const row of rows) {
            await app.tableRowHelper.translateId(row);
        }
        return rows;
    }

    private toFindConditions(): FindConditions<BcCard> {
        const params = this.getQueryObjects();
        const where: FindConditions<BcCard> = {};
        if (params.userId) {
            where.userId = params.userId;
        }
        if (params.cardTypeId) {
            where.cardTypeId = params.cardTypeId;
        }
        if (params.name) {
            where.name = params.name;
        }
        if (params.balance) {
            where.name = params.name;
        }
        if (params.id) {
            where.id = params.id;
        }
        return where;
    }
}
