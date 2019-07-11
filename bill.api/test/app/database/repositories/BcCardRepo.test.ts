import {app} from "egg-mock/bootstrap";
import {Context} from "egg";
import {createConnection, getConnection, getConnectionOptions, getCustomRepository, getRepository} from "typeorm";
import BcCardRepo from "../../../../app/database/repositories/BcCardRepo";
import Assert from "../../../../app/utils/Assert";
import {BcUser} from "../../../../app/database/entity/BcUser";
import {BcCardType} from "../../../../app/database/entity/BcCardType";

describe("test/app/database/repositories/BcCardRepo.test.ts", () => {
    let ctx: Context;
    let repo: BcCardRepo;

    before(async () => {
        ctx = app.mockContext();
        let options = await getConnectionOptions();
        await createConnection({...options,
            logging: []
        });
        repo = getCustomRepository(BcCardRepo);
    });

    after(async () => {
        await getConnection().close();
    });

    describe("getViewList", () => {
        it('with none params', async () => {
            let data = await repo.getViewList();
            for (let item of data) {
                Assert.hasText(item.id, "id is null");
                Assert.hasText(item.name, "name is null");
                Assert.hasText(item.cardTypeName, "cardTypeName is null");
                Assert.hasText(item.userName, "userName is null");
            }
        });

        it('with name', async () => {
            let data = await repo.getViewList({name: "支付宝"});
            for (let item of data) {
                Assert.isTrue(item.name === "支付宝", "query by name error");
            }
        });

        it('with searchText', async () => {
            let data = await repo.getViewList({searchText: "支"});
            for (let item of data) {
                Assert.isTrue(item.name.indexOf("支") !== -1, "query by name error");
            }
        });

        it('with cardTypeId', async () => {
            let cardType = (await getRepository(BcCardType).find())[0];
            let data = await repo.getViewList({cardTypeId: cardType.id});
            for (let item of data) {
                Assert.isTrue(item.cardTypeName === cardType.name, "query by cardTypeId error");
            }
        });

        it('with userId', async () => {
            let user = (await getRepository(BcUser).find())[0];
            let data = await repo.getViewList({userId: user.id});
            for (let item of data) {
                Assert.isTrue(item.userName === user.name, "query by userId error");
            }
        });
    });

    describe("getGroupByUserViewList", () => {
        it('has children ', async () => {
            let data = await repo.getGroupByUserViewList();
            for (let item of data) {
                Assert.notEmpty(item.children)
            }
        });

        it('has userName ', async () => {
            let data = await repo.getGroupByUserViewList();
            for (let item of data) {
                Assert.hasText(item.userName)
            }
        });
    });

    describe("calculateBalance", () => {
        it('balance not all zero', async () => {
            await repo.calculateBalance();
            let data = await repo.find();
            let isAllZero = true;
            for (let item of data) {
                if (isAllZero && item.balance !== 0) {
                    isAllZero = false;
                }
            }
            Assert.isTrue(!isAllZero)
        });

        it('not null field (updateTime,updateBy)', async () => {
            await repo.calculateBalance();
            let data = await repo.find();
            for (let item of data) {
                Assert.hasText(item.updateTime);
                Assert.hasText(item.updateBy);
            }
        });
    });
});
