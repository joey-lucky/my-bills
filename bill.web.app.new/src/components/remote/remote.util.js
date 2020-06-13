export function deleteAllEmptyChildren(data = []) {
    for (let item of data) {
        if (!item.children || item.children.length === 0) {
            delete item.children;
        } else {
            deleteAllEmptyChildren(item.children);
        }
    }
}

export function parseData(rows = [], transform = {}) {
    return rows.map((item) => {
        let newItem;
        if (typeof transform === "function") {
            newItem = transform(item);
        } else {
            newItem = {...item};
            Object.keys(transform).forEach(key => {
                let targetKey = transform[key];
                newItem[key] = item[targetKey];
            });
        }
        if (newItem.children) {
            newItem.children = parseData(newItem.children, transform);
        }
        return newItem;
    })
}

export function arrayToMap(rows = []) {
    function toMap(rows = [],map={}) {
        rows.forEach(item =>{
            if (item.children) {
                toMap(item.children,map);
            }
            map[item.id] = {...item};
            delete map[item.id].children;
        })
        return map;
    }
    return toMap(rows,{});
}

export function getTreeValuesByEndValue(rows, value) {
    function findValues(rows=[],values=[],value) {
        for (let item of rows) {
            let id = item.id;
            if (id === value) {//找到
                return [...values, id];
            }
            if (item.children && item.children.length>0) {//如果找到了，则values会改变
                let tryFindValues = [...values, id];
                const  findEdValue= findValues(item.children, tryFindValues, value);
                if (tryFindValues !== findEdValue) {
                    return findEdValue;
                }
            }
        }
        return values;
    }

    return findValues(rows, [], value);
}

export function getTreeIndexByEndValue(rows=[],value) {
    function findIndexes(rows=[],indexes=[],value) {
        for (let position = 0; position < rows.length; position++) {
            let item = rows[position];
            let id = item.id;
            if (id === value) {
                return [...indexes, position];
            }
            if (item.children && item.children.length>0) {
                const expect = [...indexes, position];
                const  result= findIndexes(item.children, expect, value);
                if (result !== expect) {
                    return result;
                }
            }
        }
        return indexes;
    }

    return findIndexes(rows, [], value);
}

export function getTreeItemsByIndexes(rows=[],indexes=[]) {
    const items = [];
    let data = rows;
    for (let index of indexes) {
        let item = data[index];
        if (!!item) {
            items.push(item);
            data = item.children || [];
        }else {
            return [];
        }
    }
    return items;
}