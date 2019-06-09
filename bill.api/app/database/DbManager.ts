import * as typeOrm from "typeorm";
import {Context} from "egg";
import {Connection} from "typeorm";
import {BcUser} from "./entity/BcUser";
import {BcBillType} from "./entity/BcBillType";
import {BcCard} from "./entity/BcCard";
import {BcCardType} from "./entity/BcCardType";
import {BdBill} from "./entity/BdBill";
import {BdBillTransfer} from "./entity/BdBillTransfer";
type Entity = BcUser|BcBillType|BcCard|BcCardType|BdBill|BdBillTransfer;


export default class DbManager {
    static async insert(ctx: Context, entity:Entity):Promise<void> {
        try {
            const userId = (await ctx.getUserInfo()).id;
            entity["create_by"] = {id: userId};
            await this.getConnection().manager.save(entity);
        } catch (e) {
            throw e;
        }
    }

    static async delete(ctx: Context, entity: any):Promise<void> {
        try {
            await this.getConnection().manager.remove(entity);
        } catch (e) {
            throw e;
        }
    }

    static getRepository<Entity>(tpe: typeOrm.ObjectType<Entity>):typeOrm.Repository<Entity> {
        return  this.getConnection().getRepository(tpe);
    }

    static getConnection():Connection{
        return typeOrm.getConnection();
    }

    static craetePageFindOption({pageSize = 15,pageIndex = 1}):typeOrm.FindManyOptions{
        const start = (pageSize * (pageIndex - 1));
        return {
            skip:start,
            take:pageSize,
        };
    }
}