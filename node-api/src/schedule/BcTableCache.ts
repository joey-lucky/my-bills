import Schedule from "./Schedule";


export default class BcTableCache implements Schedule{
    static _instance = new BcTableCache();

    private _tableCache:Map<string,any[]> = new Map();

    run = async ()=> {


    }

}