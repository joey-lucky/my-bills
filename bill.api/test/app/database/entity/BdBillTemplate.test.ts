import {app} from "egg-mock/bootstrap";
import {Context} from "egg";
import {createConnection, DeepPartial, getConnection, getConnectionOptions, getCustomRepository} from "typeorm";
import Assert from "../../../../app/utils/Assert";
import BdBillRepo from "../../../../app/database/repositories/BdBillRepo";
import {BcUser} from "../../../../app/database/entity/BcUser";
import {BdBill} from "../../../../app/database/entity/BdBill";
import {BdBillTemplate, BdBillTemplateView} from "../../../../app/database/entity/BdBillTemplate";
import * as moment from "moment";

describe("test/app/database/repositories/BdBillTemplate.test.ts", () => {
    let ctx: Context;
    let repo: BdBillRepo;

    before(async () => {
        ctx = app.mockContext();
        let options = await getConnectionOptions();
        await createConnection({
            ...options,
            logging: [],
        });
        repo = getCustomRepository(BdBillRepo);
    });
    after(async () => {
        await getConnection().close();
    });


    describe("save", () => {
        it('random save', async () => {
            let data = await BdBill.find();
            let index = Math.floor(Math.random() * data.length);
            let bill = data[index];
            let params: DeepPartial<BdBillTemplate> = JSON.parse(JSON.stringify(bill));
            let admin = await BcUser.getAdminUser();
            params.userId = admin.id;
            params.createBy = admin.id;
            params.id = "ceshi" + Date.now();
            params.name = "测试" + moment().format("YYYY-MM-DD");
            let entity = BdBillTemplate.create(params);
            await entity.save();
            let list = await BdBillTemplate.find({where: {id: params.id}});
            Assert.notEmpty(list);
        });
    });

    describe("getViewList", () => {
        it('view structure', async () => {
            function verifyView(item: BdBillTemplateView) {
                Assert.hasText(item.id, "id is null");
                Assert.hasText(item.billDesc, "billDesc is null");
                Assert.hasText(item.cardName, "cardName is null");
                Assert.hasText(item.cardUserName, "cardUserName is null");
                Assert.hasText(item.userName, "userName is null");
                Assert.hasText(item.billTypeName, "billTypeName is null");
                Assert.hasText(item.billTypeType, "billTypeType is null");
                Assert.hasText(item.billTypeTypeName, "billTypeTypeName is null");
            }

            let admin = await BcUser.getAdminUser();
            let data = await BdBillTemplate.getViewList({userId: admin.id});
            for (let item of data) {
                verifyView(item);
            }

        });
    });
});
