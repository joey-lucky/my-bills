import 'egg';
import ExportTest from "../app/service/test";
import ExportTest1 from "../app/service/test1";
import * as mysql from "egg-mysql"
declare module 'egg' {
    interface Application {
        mysql
    }
}
