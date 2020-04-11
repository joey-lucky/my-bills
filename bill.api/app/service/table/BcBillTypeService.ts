import {FindConditions} from "typeorm";
import {BcBillType} from "../../database";
import BaseService from "../BaseService";

export default class BcBillTypeService extends BaseService {
    public async groupByType(): Promise<GroupByTypeView[]> {
        const list = await this.getList();
        const map: { [key: string]: GroupByTypeView } = {};
        for (const item of list) {
            const typeName = item.typeName;
            if (!map[typeName]) {
                map[typeName] = {
                    typeName,
                    children: [],
                };
            }
            map[typeName].children.push(item);
        }
        return Object.values(map);
    }

    public async getList(): Promise<BcBillType[]> {
        const {database} = this.app;
        return await database.find(BcBillType, {where: this.toFindConditions(), order: {sort: "DESC"}});
    }

    public async getConsumerList(): Promise<BcBillType[]> {
        const {database} = this.app;
        return await database.find(BcBillType, {where: this.toFindConditions({type: "-1"}), order: {sort: "DESC"}});
    }

    private toFindConditions(params = this.getQueryObjects()): FindConditions<BcBillType> {
        const where: FindConditions<BcBillType> = {};
        if (params.type) {
            where.type = params.type;
        }
        return where;
    }
}

interface GroupByTypeView {
    typeName: string;
    children: BcBillType[];
}