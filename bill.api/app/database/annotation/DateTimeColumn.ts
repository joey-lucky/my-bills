import {Column} from "typeorm";
import * as moment from "moment";


export function DateTimeColumn(options:DateTimeColumnOptions) {
    return Column({
        name: options.name,
        type: "datetime",
        nullable:true,
        transformer: {
            from: (date: Date) => date,
            to: (date: string | Date) => {
                if (typeof date === "string") {
                    return moment(date).toDate();
                }
                return date;
            },
        }
    })
}

export interface DateTimeColumnOptions {
    name:string;
}