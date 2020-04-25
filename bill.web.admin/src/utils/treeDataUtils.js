
export function deleteAllEmptyChildren(data=[]) {
    for (let item of data) {
        if (!item.children || item.children.length === 0) {
            delete item.children;
        } else {
            deleteAllEmptyChildren(item.children);
        }
    }
}
