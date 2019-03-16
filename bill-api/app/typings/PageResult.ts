import {Application, MySql, PageInfo} from "egg";

export default interface PageResult {
    pageInfo:PageInfo,
    rows:any[],
}