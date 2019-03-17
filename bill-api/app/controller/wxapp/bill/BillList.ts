import {Controller} from 'egg';

export default class BillList extends Controller {
    /**
     * 获取分页账单信息
     */
    public async getBillPageData() {
       let result = await this.ctx.service.wxapp.billListService.getBillPageData();
        this.ctx.body.data=result.rows;
        this.ctx.body.pageInfo = result.pageInfo;
    }

    public async getUserInfo(){
        let ctx = this.ctx;
        let userInfo =await ctx.getUserInfo();
        ctx.body.data = [userInfo]
    }
}
