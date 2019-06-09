import {Application} from "egg";
import {createConnection} from "typeorm";

export default (app:Application)=>{
    app.once('server', async (server) => {
        await createConnection();
        console.log("once server");
        // websocket
    });
    app.on('error', (err, ctx) => {
        console.log("error");
    });
    app.on('request', ctx => {
        // log receive request
        console.log("on request");
    });
    app.on('response', ctx => {
        console.log("on response");
        //
        // // ctx.starttime is set by framework
        // const used = Date.now() - ctx.starttime;
        // // log total cost
    });
}
