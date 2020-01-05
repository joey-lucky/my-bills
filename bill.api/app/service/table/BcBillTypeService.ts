import {BaseService} from "../BaseService";
import {FindConditions} from "typeorm";
import {BcBillType, find} from "../../database";

export default class BcBillTypeService extends BaseService {
    public async groupByType(): Promise<GroupByTypeView[]> {
        let list = await this.getList();
        let map: { [key: string]: GroupByTypeView } = {};
        for (let item of list) {
            let typeName = item.typeName;
            if (!map[typeName]) {
                map[typeName] = {
                    typeName: typeName,
                    children: [],
                };
            }
            map[typeName].children.push(item);
        }
        return Object.values(map);
    }

    public async getList(): Promise<BcBillType[]> {
        return await find(BcBillType, {where: this.toFindConditions(), order: {sort: "DESC"}});
    }

    public async getConsumerList(): Promise<BcBillType[]> {
        return await find(BcBillType, {where: this.toFindConditions({type:"-1"}), order: {sort: "DESC"}});
    }

    private toFindConditions(params = this.getQueryObjects()): FindConditions<BcBillType> {
        let where: FindConditions<BcBillType> = {};
        if (params.type) {
            where.type = params.type;
        }
        return where;
    }
}

interface GroupByTypeView {
    typeName: string;
    children: BcBillType[]
}