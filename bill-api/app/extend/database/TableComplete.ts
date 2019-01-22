import * as UUID from "node-uuid";

export default class TableComplete {
    completeInsertTableData(data:{[key:string]:any}):{[key:string]:any}{
        data.id = data.id || UUID.v1();
        data["create_time"] = new Date();
        data["create_by"] = "001";
        return data;
    }

    completeUpdateTableData(data:{[key:string]:any}):{[key:string]:any}{
        data.id = data.id || UUID.v1();
        data["update_time"] = new Date();
        data["update_by"] = "001";
        return data;
    }
}