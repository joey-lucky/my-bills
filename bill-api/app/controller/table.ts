import {Controller} from 'egg';

export default class extends Controller {
    public async list() {
        const {ctx} = this;

        ctx.body = await ctx.service.table.list();
    }

    public async create() {
        const {ctx} = this;
        ctx.body = await ctx.service.table.create();
    }

    public async update() {

    }

    public async delete() {

    }
}
