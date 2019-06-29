import {EntityRepository, FindConditions} from "typeorm";
import BaseRepository from "../BaseRepository";
import {BcBillType} from "../entity/BcBillType";


@EntityRepository(BcBillType)
export default class BcBillTypeRepo extends BaseRepository<BcBillType> {
    public async getConsumerList(): Promise<BcBillType[]> {
        return await this.find({where: {type: "-1"}});
    }

    public async getViewList(params: QueryParams = {}): Promise<View[]> {
        let conditions: FindConditions<BcBillType>[] = [];
        if (params.type) {
            conditions.push({
                type: params.type
            });
        }
        let data: BcBillType[] = await this.find({
            where: conditions,
            order: {
                sort: "ASC"
            }
        });
        return this.entityToViewList(data);
    }

    public async getGroupByTypeList(params: QueryParams = {}): Promise<GroupByTypeView[]> {
        let list = await this.getViewList(params);
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

    private async entityToView(entity: BcBillType): Promise<View> {
        let view: View = {
            id: entity.id,
            name: entity.name,
            sort: entity.sort,
            typeName: ""
        };
        if (entity.type === "-1") {
            view.typeName = "支出";
        } else if (entity.type === "1") {
            view.typeName = "收入";
        } else {
            view.typeName = "其它";
        }
        return view;
    }

    private async entityToViewList(entities: BcBillType[]): Promise<View[]> {
        let views: View[] = [];
        for (let entity of entities) {
            views.push(await this.entityToView(entity));
        }
        return views;
    }
}


export interface QueryParams {
    type?: string,
}

export interface GroupByTypeView {
    typeName: string;
    children: View[]
}

export interface View {
    id: string;
    name: string;
    sort: number;
    typeName: string;
}