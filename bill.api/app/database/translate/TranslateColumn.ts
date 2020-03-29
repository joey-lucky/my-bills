import {TranslateColumnOptions} from "./TranslateColumnOptions";
import {pushTranslateColumn} from "./TranslateConfig";

export function TranslateColumn(options: TranslateColumnOptions) {
    return function (obj: Object, propertyName: string) {
        pushTranslateColumn({
            target: obj.constructor,
            propertyName,
            options,
        });
    };
}