import {FindConditions} from "typeorm";
import {BcCard, BcCardView, BcUser} from "../../database";
import BaseService from "../BaseService";

export default class BcCardService extends BaseService {
    public async groupByUser() {
        type GroupByUserCardView = {
            userName: string;
            children: BcCardView[]
        };
        const list:BcCardView[] = await this.getList();
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

    public async getList():Promise<BcCardView[]> {
        const {database} = this.app;
        return await database.find(BcCardView, {where: this.toFindConditions(), order: {userId: "DESC"}});
    }

    public async getAssetList() {
        const {database} = this.app;
        type Asset = { pic?: string } & BcCardView;
        const list: Asset[] = await this.getList();
        const userList: BcUser[] = await database.find(BcUser, {});
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
            // cardTypeMap[cardTypeName].children.push(item);
        }
        return Object.values(cardTypeMap);
    }

    private toFindConditions(): FindConditions<BcCardView> {
        const params = this.getQueryObjects();
        const where: FindConditions<BcCardView> = {};
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
