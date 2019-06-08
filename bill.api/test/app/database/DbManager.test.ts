import {app} from "egg-mock/bootstrap";
import {Context} from "egg";
import {Connection, createConnection, getConnection, getRepository} from "typeorm";
// import {BdBill} from "../../../app/database/entity/BdBill";
// import {BcUser} from "../../../app/database/entity/BcUser";
import {BcCard} from "../../../app/database/entity/BcCard";
import {BdBill} from "../../../app/database/entity/BdBill";

describe("test/app/database/DbManager.test.ts", () => {
    let ctx: Context;

    before(async () => {
        ctx = app.mockContext();

    });

    it('sayHi', async () => {
        await createConnection();
        let data = await BdBill.getPageData({pageIndex: 1, pageSize: 15}, {});

        // let user = new BcUser();
        // user.name = "测试";
        // user.loginName = "hqy";
        // user.loginPassword = "123456";
        // user.pic = " ";
        // let entity = new BcCard();
        // entity.name = "测试类型";
        // entity.userId = "b675289f-3446-4cf2-81bc-046eb61ce55a";
        // entity.balance = 1;
        // entity.cardTypeId = "1";
        // await entity.save();
        console.log(Object.keys(data[0]));
        data.forEach(item=>{

        });
        console.log(JSON.stringify(data));

        // const data:BdBill[] = await connect.getRepository(BdBill).find({
        //     relations:["card","user","billType"],
        //     loadRelationIds:false,
        //     loadEagerRelations:true,
        //     skip:100,
        //     take:5,
        // });
        // await connect.getRepository(BcUser).find();
        // await connect.getRepository(BcBillType).find();
        // let user = new BcUser();
        // user.name = "测试";
        //
        // await connect.manager.save(user);
        // assert(data.length>0);
        return "sayHi";
    });
});
