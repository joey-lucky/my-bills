import {Context} from "egg";
import {createConnection, getConnection, getConnectionOptions} from "typeorm";
import {getCurrFilePath} from "../../utils";
import RestFulTest from "./RestFulTest";
const {app, mock, assert} = require('egg-mock/bootstrap');

let restFulTest = new RestFulTest("/users");

describe(getCurrFilePath(__dirname), () => {
    let ctx: Context;

    before(async () => {
        ctx = app.mockContext();
        // let options = await getConnectionOptions();
        // await createConnection({
        //     ...options,
        // });
    });

    after(async () => {
        // await getConnection().close();
    });

    restFulTest.describeIndex({});
});
