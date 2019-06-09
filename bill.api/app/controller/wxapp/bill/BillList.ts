import {Controller} from "egg";
import {getCustomRepository} from "typeorm";
import BdBillRepo from "../../../database/repositories/BdBillRepo";
import * as moment from "moment";
import BcUserRepo from "../../../database/repositories/BcUserRepo";
import Assert from "../../../utils/Assert";

interface BillData {
    id: string;
    cardName: string;
    cardUserName: string;
    userName: string;
    billTypeName: string;
    billTypeType: string;
    money: number;
    billDesc: string;
    dateTime: string;
}

export default class BillList extends Controller {
    /**
     * 获取分页账单信息
     */
    public async getBillPageData() {
        const params = this.ctx.request.queryObjects;
        let [data, pageInfo] = await getCustomRepository(BdBillRepo).getPageData(
            params["pageInfo"],
            {
                userId: params["user_id"],
                dateTime: params["date_time"] && params["date_time"].map(item => moment(item).toDate()),
                billTypeId: params["bill_type_id"],
            });
        let rows: BillData[] = [];
        for (let item of data) {
            let cardUserId = item.card.userId;
            let cardUserName = await getCustomRepository(BcUserRepo).findUserName(cardUserId);
            rows.push({
                id: item.id,
                cardName: item.card.name,
                cardUserName: cardUserName,
                userName: item.user.name,
                billTypeName: item.billType.name,
                money: item.money,
                billDesc: item.billDesc,
                dateTime: item.dateTime,
                billTypeType:item.billType.type
            });
        }
        this.ctx.body.data = rows;
        this.ctx.body.pageInfo = pageInfo;
    }

    public async getBillEntity() {
        let id = this.ctx.request.queryObjects.id;
        Assert.hasText(id, "id不能为空");
        let data = await getCustomRepository(BdBillRepo).findOne(id,{
            relations:["billTransfer"]
        });
        Assert.notNull(data, "id不存在");
        this.ctx.body.data = [data];
    }

    public async getUserInfo() {
        const ctx = this.ctx;
        const userInfo = ctx.user;
        ctx.body.data = [userInfo];
    }
}
