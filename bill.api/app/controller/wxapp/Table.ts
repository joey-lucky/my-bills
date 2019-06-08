import {Application, Context, Controller} from "egg";

export default class extends Controller {
    public async list() {
        const app: Application = this.app;
        const ctx: Context = this.ctx;
        ctx.body.data = await ctx.service.table.common.list(ctx.request.queryObjects);
    }

    public async create() {
        const app: Application = this.app;
        const ctx: Context = this.ctx;
        await ctx.service.table.common.create(ctx.request.queryObjects);
        ctx.body.message = "保存成功";
    }

    public async update() {
        const app: Application = this.app;
        const ctx: Context = this.ctx;
        await ctx.service.table.common.update(ctx.request.queryObjects);
        ctx.body.message = "更改成功";
    }

    public async delete() {
        const app: Application = this.app;
        const ctx: Context = this.ctx;
        await ctx.service.table.common.delete(ctx.request.queryObjects);
        ctx.body.message = "删除成功";
    }
}
