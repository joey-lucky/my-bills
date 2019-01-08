import {Controller} from 'egg';

export default class extends Controller {
    public async index() {
        const {ctx} = this;
        let data =await  this.app.mysql.query("select * from bc_user", []);
        console.log(data);
        ctx.body = await ctx.service.test.sayHi('egg');
    }
}
