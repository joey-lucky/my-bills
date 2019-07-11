import {app} from "egg-mock/bootstrap";
import {Context} from "egg";
import {createConnection, getConnection, getConnectionOptions, getCustomRepository} from "typeorm";
import BcUserRepo from "../../../../app/database/repositories/BcUserRepo";

describe("test/app/database/repositories/BcUserRepo.test.ts", () => {
    let ctx: Context;
    let repo: BcUserRepo;

    before(async () => {
        ctx = app.mockContext();
        let options = await getConnectionOptions();
        await createConnection({...options, logging: []});
        repo = getCustomRepository(BcUserRepo);
    });
    after(async () => {
        await getConnection().close();
    });

    describe("getViewList", () => {

    });
});
