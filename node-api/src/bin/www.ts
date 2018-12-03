import Log from "../utils/Log";
import app from "../app";
import * as http from "http";
let start = Date.now();
let server = http.createServer(app.callback());
server.listen(3000,()=>{
    Log.info('server is running at http://localhost:3000',(Date.now()-start)+"ms");
});
