import {getRepository} from "typeorm";
import {BcBillType} from "../../app/database/entity/BcBillType";
import {BcCardType} from "../../app/database/entity/BcCardType";
import {BcCard} from "../../app/database/entity/BcCard";
import {BcUser} from "../../app/database/entity/BcUser";
import * as moment from "moment";

export default class DatabaseUtilsTest {
    public static async  getBillTypeId ():Promise<string>{
        let list = await getRepository(BcBillType).find();
        return list[this.randomInt(list.length)].id;
    }

    public static async  getCardTypeId ():Promise<string>{
        let list = await getRepository(BcCardType).find();
        return list[this.randomInt(list.length)].id;
    }

    public static async  getCardId ():Promise<string>{
        let list = await getRepository(BcCard).find();
        return list[this.randomInt(list.length)].id;
    }

    public static async  getUserId ():Promise<string>{
        let list = await getRepository(BcUser).find();
        return list[this.randomInt(list.length)].id;
    }

    public static async  getDatetime ():Promise<string>{
        return moment().format("YYYY-MM-DD HH:mm:ss");
    }

    private static randomInt(max:number){
       return  Math.floor(Math.random() *max);
    }
}