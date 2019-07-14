import {app} from "egg-mock/bootstrap";
import {Context} from "egg";
import {createConnection, getConnection, getConnectionOptions, getCustomRepository, getRepository} from "typeorm";
import {BcUser} from "../../../app/database/entity/BcUser";
import BillEditService from "../../../app/service/BillEditService";
import DatabaseUtilsTest from "../DatabaseUtils.test";
import BdBillRepo from "../../../app/database/repositories/BdBillRepo";
import Assert from "../../../app/utils/Assert";

describe("test/app/service/BillEdit.test.ts", () => {
    let ctx: Context;
    let service: BillEditService;

    before(async () => {
        ctx = app.mockContext();
        let options = await getConnectionOptions();
        await createConnection({
            ...options,
            logging: []
        });
        let userList = await getRepository(BcUser).find();
        ctx.user = userList[0];
        service = new BillEditService(ctx);
    });

    after(async () => {
        await getConnection().close();
    });

    describe("createBill",()=>{
        it("normal bill", async () => {
            let params: any = {
                billDesc: "测试billDesc",
                cardId: await DatabaseUtilsTest.getCardId(),
                billTypeId: await DatabaseUtilsTest.getBillTypeId(),
                dateTime: await DatabaseUtilsTest.getDatetime(),
                money: -12321,
            };
            let bill = await service.createBill(params);
            let data = await getCustomRepository(BdBillRepo).findOneView(bill.id);
            Assert.isTrue(!data.targetCardName)
        });
        it("transfer bill", async () => {
            let params: any = {
                billDesc: "测试billDesc",
                cardId: await DatabaseUtilsTest.getCardId(),
                billTypeId: await DatabaseUtilsTest.getBillTypeId(),
                dateTime: await DatabaseUtilsTest.getDatetime(),
                money: -12321,
                targetCardId: await DatabaseUtilsTest.getCardId(),
            };
            let bill = await service.createBill(params);
            let data = await getCustomRepository(BdBillRepo).findOneView(bill.id);
            Assert.hasText(data.targetCardName)
        });
    });


});
