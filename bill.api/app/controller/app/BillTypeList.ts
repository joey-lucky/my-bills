import {Controller} from "egg";
import {getCustomRepository} from "typeorm";
import BcBillTypeRepo from "../../database/repositories/BcBillTypeRepo";

export default class extends Controller {
    //获取账单列表
    public async getList() {
        console.log("getList");
        this.ctx.body.data = await getCustomRepository(BcBillTypeRepo).getViewList({})
    }
}
