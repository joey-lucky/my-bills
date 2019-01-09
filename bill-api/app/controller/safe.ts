import {Controller} from 'egg';

export default class extends Controller {
    public async login() {
        const {ctx} = this;
        ctx.body = await ctx.service.safe.login(ctx.query);
    }
}
