import {app} from "egg-mock/bootstrap";
import {Context} from "egg";
import {createConnection, getConnection, getConnectionOptions} from "typeorm";
import {BcToken} from "../../../../app/database";

describe("test/app/database/repositories/BdStatBillMRepo.test.ts", () => {
    let ctx: Context;

    before(async () => {
        ctx = app.mockContext();
        let options = await getConnectionOptions();
        await createConnection({
            ...options,
            // logging: []
        });
        // await initAllCache();
        // repo = getCustomRepository(BdStatBillMRepo);
    });
    after(async () => {
        await getConnection().close();
    });
    describe("generateOneMonth", () => {
        it('month date change', async () => {
            let entity = new BcToken();
            entity.type = "1";
            entity.accessToken = "xx";
            entity.expiresIn = new Date();
            entity.corpId = "xx";
            entity.secret = "x";
            entity.createBy = "admin";
            entity.updateBy = "admin";
            entity.updateTime = new Date();
            entity.createTime = new Date();
            await entity.save();
        });
    });
});
