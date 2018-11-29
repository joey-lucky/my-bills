import * as Koa from "koa";
import * as Router from "koa-router";
import initRouter from "./router";

let app = new Koa();
let router = new Router();

initRouter(router);
app.use(router.routes());
export default app;
