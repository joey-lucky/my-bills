import {Controller} from "egg";
import * as jwt from "jsonwebtoken";
import {TokenPlayLoad} from "../typings/token";

export default class Safe extends Controller {
    public async login() {
        const user = await this.ctx.service.safeService.login();
        const secret = this.config.secret;
        const playLoad: TokenPlayLoad = {userId: user.id};
        user.token = jwt.sign(playLoad, secret);
        this.ctx.body.data = [user];
    }
}
