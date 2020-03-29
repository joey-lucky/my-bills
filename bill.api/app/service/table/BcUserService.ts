import {FindConditions} from "typeorm";
import {BcUser, find} from "../../database";
import {BaseService} from "../BaseService";

export default class BcUserService extends BaseService {
    public async getList() {
        return await find(BcUser, {where: this.toFindConditions(), order: {name: "DESC"}});
    }

    private toFindConditions(): FindConditions<BcUser> {
        const params = this.getQueryObjects();
        const where: FindConditions<BcUser> = {};
        return where;
    }
}
