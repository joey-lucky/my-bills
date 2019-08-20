import {Controller} from "egg";
import {getCustomRepository} from "typeorm";
import BcUserRepo from "../database/repositories/BcUserRepo";
import {BcUser} from "../database/entity/BcUser";
import EncryptUtils from "../utils/EncryptUtils";

export default class Safe extends Controller {
    public async login() {
        const {ctx,app} = this;
        const params = ctx.request.queryParams;
        const userName = params["userName"];
        const password = params["password"];
        let entity: BcUser = await getCustomRepository(BcUserRepo).login(userName, password);
        entity["token"] = EncryptUtils.generateToken(entity.id);
        ctx.body.data = [entity];
    }
}
