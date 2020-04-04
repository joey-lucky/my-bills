export const requestMappingSet:Set<any> = new Set();

export function RequestMapping():any {
    return function (obj: Object, propertyName: string,...args) {
        console.log("RequestMapping", obj,propertyName);
    }
}
