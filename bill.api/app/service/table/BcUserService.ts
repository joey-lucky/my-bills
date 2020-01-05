import {BaseService} from "../BaseService";
import {FindConditions} from "typeorm";
import {BcUser, find} from "../../database";

export default class BcUserService extends BaseService {
    public async getList() {
        return await find(BcUser, {where: this.toFindConditions(), order: {name: "DESC"}});
    }

    private toFindConditions(): FindConditions<BcUser> {
        const params = this.getQueryObjects();
        let where: FindConditions<BcUser> = {};
        return where;
    }
}
