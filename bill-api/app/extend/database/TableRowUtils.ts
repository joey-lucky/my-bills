import {Context} from "egg";
import * as UUID from "node-uuid";

export class TableRowUtils {
    completeInsertTableRow(row, ctx: Context): any {
        row.id = row.id || UUID.v1();
        row["create_time"] = new Date();
        row["create_by"] = ctx.userInfo.id;
        return row;
    }

    completeUpdateTableRow(row, ctx: Context): any {
        row.id = row.id || UUID.v1();
        row["update_time"] = new Date();
        row["update_by"] = ctx.userInfo.id;
        return row;
    }
}
