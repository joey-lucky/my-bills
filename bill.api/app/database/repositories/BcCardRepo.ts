import {
    EntityRepository,
    FindConditions,
    FindOneOptions,
    FindOperator,
    getConnection,
    getCustomRepository,
    getRepository
} from "typeorm";
import BaseRepository from "../BaseRepository";
import {BcCard} from "../entity/BcCard";
import {BcCardType} from "../entity/BcCardType";
import {BcUser} from "../entity/BcUser";
import BcUserRepo from "./BcUserRepo";

@EntityRepository(BcCard)
export default class BcCardRepo extends BaseRepository<BcCard> {
    public async getViewList(params: QueryParams = {}): Promise<BcCardView[]> {
        let conditions: FindConditions<BcCard>[] = [];
        if (params.userId) {
            conditions.push({
                user: await getRepository(BcUser).findOne(params.userId)
            });
        }
        if (params.cardTypeId) {
            conditions.push({cardType: await getRepository(BcCardType).findOne(params.cardTypeId)});
        }
        if (params.name) {
            conditions.push({name: params.name});
        }
        if (params.balance) {
            conditions.push({balance: params.balance});
        }
        if (params.searchText) {
            conditions.push({name: new FindOperator("like", "%" + params.searchText + "%")});
        }
        let data: BcCard[] = await this.find({
            where: conditions,
            relations: ["cardType", "user"],
            order: {
                name: "ASC"
            }
        });
        return this.entityToViewList(data);
    }

    public async calculateBalance():Promise<void> {
        async function getBillMoneyStatMap(): Promise<Map<string, number>> {
            // language=MySQL
            let data = await getConnection().query("select bb.card_id,sum(bb.money) as money\n" +
                "    from bd_bill bb\n" +
                "    group by  bb.card_id");
            let map: Map<string, number> = new Map<string, number>();
            for (let item of data) {
                map.set(item["card_id"], item.money);
            }
            return map;
        }

        async function getTransferBillMoneyStatMap(): Promise<Map<string, number>> {
            let data = await getConnection().query(
                // language=MySQL
                "select t.target_card_id,\n" +
                "       sum(t1.money) as money\n" +
                "from bd_bill_transfer t\n" +
                "       left join bd_bill t1 on t1.id = t.bill_id\n" +
                "group by t.target_card_id"
            );
            let map: Map<string, number> = new Map<string, number>();
            for (let item of data) {
                map.set(item["target_card_id"], 0 - item.money);
            }
            return map;
        }

        let billMoneyMap: Map<string, number> = await getBillMoneyStatMap();
        let transferBillMoneyMap: Map<string, number> = await getTransferBillMoneyStatMap();
        let data = await getCustomRepository(BcCardRepo).find();
        let adminUser = await BcUser.getAdminUser();
        for (let item of data) {
            let billMoney = billMoneyMap.get(item.id) || 0;
            let transferMoney = transferBillMoneyMap.get(item.id) || 0;
            let balance = billMoney + transferMoney;
            item.balance = Math.round(balance * 100) / 100;
            item.updateBy = adminUser.id;
        }
        await getCustomRepository(BcCardRepo).save(data);
    }

    public async getGroupByUserViewList(params: QueryParams = {}): Promise<GroupByUserCardView[]> {
        let list = await this.getViewList(params);
        let map: { [key: string]: GroupByUserCardView; } = {};
        for (let item of list) {
            let userName = item.userName;
            if (!map[userName]) {
                map[userName] = {
                    userName: userName,
                    children: [],
                };
            }
            map[userName].children.push(item);
        }
        return Object.values(map);
    }

    private async findViewOne(id?: string, options?: FindOneOptions<BcCard>) {
        let entity: BcCard = await this.findOne(id, options);
        return this.entityToView(entity);
    }

    private async entityToView(entity: BcCard): Promise<BcCardView> {
        let view = {
            id: entity.id,
            name: entity.name,
            balance: entity.balance,
            cardTypeName: "",
            userName: "",
        };
        let cardType = entity.cardType;
        let user = entity.user;
        view.cardTypeName = cardType.name;
        view.userName = user.name;
        return view;
    }

    private async entityToViewList(entities: BcCard[]): Promise<BcCardView[]> {
        let views: BcCardView[] = [];
        for (let entity of entities) {
            views.push(await this.entityToView(entity));
        }
        return views;
    }
}

interface QueryParams {
    searchText?: string;
    name?: string;
    userId?: string;
    cardTypeId?: string;
    balance?: number;
}

export interface BcCardView {
    id: string;
    name: string;
    userName: string;
    cardTypeName: string;
    balance: number;
}

export interface GroupByUserCardView {
    userName: string;
    children: BcCardView[]
}
