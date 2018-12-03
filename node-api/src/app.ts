import Log from "./utils/Log";
Log.info('start server...');
let start = Date.now();

import * as Koa from "koa";
import * as logger from "koa-log";
import * as bodyParser from "koa-bodyparser";
import Schedules from "./schedule/Schedules";
import Controllers from "./controller/Controllers";

const app = new Koa();
//路由初始化
const router = Controllers.init();
//定时任务初始化
Schedules.init();
app.use(bodyParser());
app.use(logger());
app.use(router.routes());
Log.info('server init success', (Date.now() - start) + "ms");
export default app;
