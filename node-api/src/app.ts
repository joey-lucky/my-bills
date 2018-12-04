import Log from "./utils/Log";
import * as Koa from "koa";
import * as logger from "koa-log";
import * as bodyParser from "koa-bodyparser";
// import * as body from "koa-body";
import Schedules from "./schedule/Schedules";
import Controllers from "./controller/Controllers";

Log.info('start server...');
let start = Date.now();

const app = new Koa();
//定时任务初始化
// app.use(body());
app.use(bodyParser());
app.use(logger());
app.use(Controllers.generateControllers().routes());
Log.info('server init success', (Date.now() - start) + "ms");
Schedules.init();
export default app;
