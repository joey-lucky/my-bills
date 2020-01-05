import {Subscription} from "egg";
import {LessThanOrEqual} from "typeorm";
import {BcToken, find} from "../database";
import Assert from "../utils/Assert";

export default class TokenSchedule extends Subscription {
    private static EXPIRES_THRESHOLD = 20 * 60 * 1000;

    static get schedule() {
        return {
            interval: "60s", // 60 分钟间隔
            type: "all", // 指定所有的 worker 都需要执行
            immediate: true
        };
    }

    async subscribe() {
        try {
            let tokenEntityList = await find(BcToken, {
                where: {
                    expiresIn: LessThanOrEqual(new Date(Date.now() - TokenSchedule.EXPIRES_THRESHOLD))
                }
            });
            for (let entity of tokenEntityList) {
               await this.refreshQYWeChat(entity);
            }
            this.app.loggers.logger.info("[schedule]", "TokenSchedule success");
        } catch (e) {
            this.app.loggers.logger.info("[schedule]", "TokenSchedule error " + e.message);
            throw e;
        }
    }

    async refreshQYWeChat(tokenEntity: BcToken) {
        const {secret, corpId} = tokenEntity;
        const {data} = await this.ctx.curl("https://qyapi.weixin.qq.com/cgi-bin/gettoken", {
            method: 'GET',
            contentType: 'json',
            data: {
                corpid: corpId,
                corpsecret: secret,
            },
            dataType: 'json',
        });
        try {
            Assert.isTrue(data.errcode === 0, "errcode不为0");
            tokenEntity.accessToken = data["access_token"];
            tokenEntity.expiresIn = new Date(data["expires_in"]*1000 + Date.now());
            await tokenEntity.save();
        } catch (e) {
            this.app.loggers.logger.info("[schedule]", "TokenSchedule 企业微信token获取失败 " + e.message);
        }
    }
}