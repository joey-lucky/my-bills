import {Application, Context, Service} from "egg";
import Assert from "../../utils/Assert";

export default class extends Service {

    public async create(params: any) {
        throw new Error("数据库插入异常");
    }

    public async update(params: any|any[]) {
        const app: Application = this.app;
        const ctx: Context = this.ctx;
        await app.tableRowHelper.completeInsertTableRow(params, ctx);
    }

    public async delete(params) {

    }
}

