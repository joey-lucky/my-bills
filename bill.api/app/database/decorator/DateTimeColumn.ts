import * as moment from "moment";
import {Column} from "./Column";

export function DateTimeColumn() {
    return Column({
        type: "datetime",
        nullable: true,
        transformer: {
            from: (date: Date) => date && moment(date).format("YYYY-MM-DD HH:mm:ss"),
            to: (date: string | Date) => {
                if (typeof date === "string") {
                    return moment(date).toDate();
                }
                return date;
            },
        },
    });
}
