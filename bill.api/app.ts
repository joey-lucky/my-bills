import {Application} from "egg";
import {createConnection} from "typeorm";

export default (app:Application)=>{
    app.once('server', async (server) => {
        await createConnection();
        console.log("once server");
    });
    app.on('error', (err, ctx) => {
        console.log("error");
    });
    app.on('request', ctx => {
        console.log("on request");
    });
    app.on('response', ctx => {
        console.log("on response");
    });
}
