import {Subscription} from "egg";
import {BcToken, BcUser, BdSendMessage} from "../database";
import Assert from "../utils/Assert";

export default class SendMessageSchedule extends Subscription {
    static get schedule() {
        return {
            interval: "60s", // 60 分钟间隔
            type: "worker", // 指定所有的 worker 都需要执行
            immediate: false,
            disable: true,
        };
    }

    async subscribe() {
        const {dbManager} = this.app;
        try {
            const entityList: BdSendMessage[] = await dbManager.find(BdSendMessage, {
                where: {
                    sendStatus: "0",
                },
            });
            for (const entity of entityList) {
                await this.sendMessage(entity);
            }
            this.app.loggers.logger.info("[schedule]", "SendMessageSchedule success");
        } catch (e) {
            this.app.loggers.logger.info("[schedule]", "SendMessageSchedule error " + e.message);
            throw e;
        }
    }

    async sendMessage(entity: BdSendMessage) {
        const {ctx} = this;
        const {dbManager} = this.app;
        const {msgContent, userId, tokenId} = entity;
        try {
            const tokenEntity: BcToken = await dbManager.findOne(BcToken, tokenId);
            const user = await dbManager.findOne(BcUser, userId);
            const {bussWx} = user;
            Assert.hasText(bussWx, "企业微信号不存在");
            const {data} = await ctx.curl("https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=" + tokenEntity.accessToken, {
                method: "POST",
                contentType: "json",
                data: {
                    // "access_token": tokenEntity.accessToken,
                    touser: bussWx,
                    // "toparty" : "PartyID1|PartyID2",
                    // "totag" : "TagID1 | TagID2",
                    msgtype: "text",
                    agentid: tokenEntity.agentId,
                    text: {
                        content: msgContent,
                    },
                    safe: 0,
                    enable_id_trans: 0,
                    enable_duplicate_check: 0,
                },
                dataType: "json",
            });
            Assert.isTrue(data.errcode === 0, "errcode不为0");
            await entity.save();
        } catch (e) {
            entity.errorCode = "0";
            this.app.loggers.logger.info("[schedule]", "SendMessageSchedule 消息发送失败 " + entity.id + e.message);
        }
        entity.sendStatus = "1";
        entity.sendTime = new Date();
        await entity.save();
    }
}