import {Controller} from "egg";

export default class extends Controller {

    //获取当前汇总
    public async getCurrTotal() {
        this.ctx.body.data = await this.ctx.service.app.homeService.getCurrTotal();
    }
}
