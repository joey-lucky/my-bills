import {Controller} from "egg";
import {getCustomRepository} from "typeorm";
import BcBillTypeRepo from "../../../database/repositories/BcBillTypeRepo";
import BcCardRepo from "../../../database/repositories/BcCardRepo";
import {BcBillType} from "../../../database/entity/BcBillType";

export default class extends Controller {
    public async getCardList() {
        this.ctx.body.data = await getCustomRepository(BcCardRepo).getGroupByUserViewList();
    }
    public async getBillTypeList() {
        let {typeName} = this.ctx.request.queryObjects;
        let params: any = {};
        if (typeName) {
            params.type = BcBillType.getTypeByTypeName(typeName);
        }
        this.ctx.body.data = await getCustomRepository(BcBillTypeRepo).getGroupByTypeList(params);
    }
}
