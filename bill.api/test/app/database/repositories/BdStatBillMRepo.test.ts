import {app} from "egg-mock/bootstrap";
import {Context} from "egg";
import {createConnection, getConnection, getConnectionOptions, getCustomRepository} from "typeorm";
import BdStatBillMRepo from "../../../../app/database/repositories/BdStatBillMRepo";
import Assert from "../../../../app/utils/Assert";

describe("test/app/database/repositories/BdStatBillMRepo.test.ts", () => {
    let ctx: Context;
    let repo: BdStatBillMRepo;

    before(async () => {
        ctx = app.mockContext();
        let options = await getConnectionOptions();
        await createConnection({
            ...options,
            logging: []
        });
        repo = getCustomRepository(BdStatBillMRepo);
    });
    after(async () => {
        await getConnection().close();
    });

    describe("generate", () => {
        it('not null field (userId、surplus、outgoing、income)', async () => {
            await repo.generate();
            let data = await repo.find();
            for (let item of data) {
                Assert.hasText(item.userId);
                Assert.notNull(item.surplus);
                Assert.notNull(item.outgoing);
                Assert.notNull(item.income);
            }
        });
        it('money (surplus,outgoing,income) not all zero', async () => {
            await repo.generate();
            let isAllZero = true;
            let data = await repo.find();
            for (let item of data) {
                if (isAllZero && (item.surplus !== 0 || item.outgoing !== 0 || item.income !== 0)) {
                    isAllZero = false;
                }
            }
            Assert.isTrue(!isAllZero);
        });
        it('money (outgoing,income) >= 0 ', async () => {
            await repo.generate();
            let data = await repo.find();
            for (let item of data) {
                Assert.isTrue(item.outgoing >= 0);
                Assert.isTrue(item.income >= 0);
            }
        });
        it('surplus = income - outgoing', async () => {
            await repo.generate();
            let data = await repo.find();
            for (let item of data) {
                let surplus = item.income - item.outgoing;
                surplus = Math.round(surplus * 100) / 100;
                if (surplus !== item.surplus) {
                    Assert.equal(surplus, item.surplus);
                }
            }
        });
    });
    describe("generateOneMonth", () => {
        it('month date change', async () => {
            let one  = await repo.findOne();
            let id = one.id; //判断这个id的数据不见了即可
            await repo.generateOneMonth(one.dateTime);
            let data = await repo.find();
            let findIndex = data.findIndex(item => item.id === id);
            Assert.isTrue(findIndex === -1);
        });
    });
});
