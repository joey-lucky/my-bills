import {app} from "egg-mock/bootstrap";
import {Context} from "egg";
import {createConnection, getConnection, getConnectionOptions, getCustomRepository, getRepository} from "typeorm";
import Assert from "../../../../app/utils/Assert";
import BdBillRepo, {BdBillView} from "../../../../app/database/repositories/BdBillRepo";
import {BdBillTransfer} from "../../../../app/database/entity/BdBillTransfer";
import {BcUser} from "../../../../app/database/entity/BcUser";
import {BcCard} from "../../../../app/database/entity/BcCard";
import {BcBillType} from "../../../../app/database/entity/BcBillType";
import BcCardRepo from "../../../../app/database/repositories/BcCardRepo";

describe("test/app/database/repositories/BdBillRepo.test.ts", () => {
    let ctx: Context;
    let repo: BdBillRepo;

    before(async () => {
        ctx = app.mockContext();
        let options = await getConnectionOptions();
        await createConnection({...options, logging: []});
        repo = getCustomRepository(BdBillRepo);
    });
    after(async () => {
        await getConnection().close();
    });

    describe("getViewPageData", () => {
        function verifyPageInfo(pageInfo) {
            Assert.isTrue(pageInfo.pageSize > 0, "pageSize <= 0");
            Assert.isTrue(pageInfo.pageIndex === 1, "pageIndex !== 1");
            Assert.isTrue(pageInfo.pageCount > 0, "pageCount <= 0");
            Assert.isTrue(pageInfo.count > 0, "count <= 0");
        }

        function verifyView(item) {
            Assert.hasText(item.id, "id is null");
            Assert.hasText(item.money, "money is null");
            Assert.hasText(item.billDesc, "billDesc is null");
            Assert.hasText(item.dateTime, "dateTime is null");
            Assert.hasText(item.cardName, "cardName is null");
            Assert.hasText(item.cardUserName, "cardUserName is null");
            Assert.hasText(item.userName, "userName is null");
            Assert.hasText(item.billTypeName, "billTypeName is null");
        }

        function verifyTransferSpecialView(item) {
            Assert.hasText(item.targetCardName, "targetCardName is null");
            Assert.hasText(item.targetCardUserName, "targetCardUserName is null");
        }

        it('with none params', async () => {
            let temp = await getRepository(BcCard).find();
            let result = await getCustomRepository(BdBillRepo).getViewPageData();
            let data: BdBillView[] = result[0];
            let pageInfo = result[1];
            verifyPageInfo(pageInfo);
            for (let item of data) {
                verifyView(item);
            }
        });

        it('with transfer bill id', async () => {
            let transferList = await getRepository(BdBillTransfer).find({relations:["bill"]});
            let billId =transferList[0].bill.id;
            let result = await getCustomRepository(BdBillRepo).getViewPageData({}, {id: billId});
            let item = result[0][0];
            verifyPageInfo(result[1]);
            verifyView(item);
            verifyTransferSpecialView(item);
        });

        it('with userId', async () => {
            let entity = (await getRepository(BcUser).find())[0];
            let result = await getCustomRepository(BdBillRepo).getViewPageData({}, {userId: entity.id});
            verifyPageInfo(result[1]);
            for (let item of result[0]) {
                verifyView(item);
                Assert.equal(item.userName, entity.name);
            }
        });

        it('with cardId', async () => {
            let entity = (await getRepository(BcCard).find())[0];
            let result = await getCustomRepository(BdBillRepo).getViewPageData({}, {cardId: entity.id});
            verifyPageInfo(result[1]);
            for (let item of result[0]) {
                verifyView(item);
                Assert.equal(item.cardName, entity.name);
            }
        });

        it('with billTypeId', async () => {
            let entity = (await getRepository(BcBillType).find())[0];
            let result = await getCustomRepository(BdBillRepo).getViewPageData({}, {billTypeId: entity.id});
            verifyPageInfo(result[1]);
            for (let item of result[0]) {
                verifyView(item);
                Assert.equal(item.billTypeName, entity.name);
            }
        });
    });
});
