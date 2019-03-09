import {Service} from 'egg';

export default class BcUser extends Service {
    public async getUserByLoginName(loginName: string): Promise<object> {
        const {app: {sqlExecutor}} = this;
        return await this.app.sqlExecutor.get("bc_user", {login_name: loginName});
    }
}
