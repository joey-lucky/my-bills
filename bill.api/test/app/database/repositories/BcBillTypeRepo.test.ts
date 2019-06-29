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
import BcBillTypeRepo from "../../../../app/database/repositories/BcBillTypeRepo";
import {BcCardType} from "../../../../app/database/entity/BcCardType";

describe("test/app/database/repositories/BcBillTypeRepo.test.ts", () => {
    let ctx: Context;
    let repo: BcBillTypeRepo;

    before(async () => {
        ctx = app.mockContext();
        let options = await getConnectionOptions();
        await createConnection({...options, logging: []});
        repo = getCustomRepository(BcBillTypeRepo);
    });
    after(async () => {
        await getConnection().close();
    });
    describe("getGroupByTypeList", () => {
        it('has children', async () => {
            let data = await repo.getGroupByTypeList();
            for (let item of data) {
                Assert.notEmpty(item.children)
            }
        });
    });

    describe("getConsumerList", () => {
        it('type = -1', async () => {
            let data = await repo.getConsumerList();
            for (let item of data) {
                Assert.equal(item.type, "-1");
            }
        });
    });
});
