import app from "../app/app";
import * as http from "http";

let server = http.createServer(app.callback());
server.listen(3000);
//
// app.listen(3000, () => {
//     console.log('server is running at http://localhost:3000')
// });
