import * as Koa from "koa";
import * as Router from "koa-router";
// @ts-ignore
import * as logger from "koa-log";
// @ts-ignore
import * as koaBody from "koa-body";

import initRouter from "./router";

let app = new Koa();
let router = new Router();
// app.use(bodyParser());
app.use(koaBody());
app.use(logger());
initRouter(router);
app.use(router.routes());
export default app;
