import {useEffect, useState} from "react";
import {request} from "@utils/request";
import * as PropTypes from "prop-types";

/**
 * 1、自动根据 url params 从服务器获取数据。
 * 2、自动解析数据成 {id,name} 格式
 * 3、自动解析数据成指定的数据 如{label,value}
 */
export default function RemoteData(options) {
    let {idKey = "id", nameKey = "name"} = options;

    const propsTypes = {
        value: PropTypes.string,
        defaultValue: PropTypes.string,
        url: PropTypes.string,
        parse: PropTypes.oneOfType([
            PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string,
                children: PropTypes.any,
            }),
            PropTypes.func
        ]),
        params: PropTypes.any,
        extra: PropTypes.array,
        data: PropTypes.array,
    };

    //将id name 转换成对应的字段
    function parseFormData(rows = []) {
        return rows.map((item) => {
            let newItem = {
                ...item,
                [idKey]: item.id,
                [nameKey]: item.name,
            };
            if (newItem.children) {
                newItem.children = parseFormData(newItem.children);
            }
            return newItem;
        })
    }

    function parseRemoteData(rows, parseFunctionOrObject = {}) {
        const {id = "id", name = "name"} = parseFunctionOrObject;
        return rows.map((item) => {
            if (item) {
                if (typeof parseFunctionOrObject === "function") {
                    item = parseFunctionOrObject(item);
                    if (item.children) {
                        item.children = parseRemoteData(item.children, parseFunctionOrObject);
                    }
                } else {
                    item.id = item[id];
                    item.name = item[name];
                    if (item.children) {
                        item.children = parseRemoteData(item.children, parseFunctionOrObject.children);
                    }
                }
            }
            return item;
        });
    }

    function getState(props) {
        const [data, setData] = useState([]);
        const [value, setValue] = useState(props.value || props.defaultValue);

        const changeValue = (targetValue) => {
            // let indexList = findIndexListWithValue(data, targetValue);
            // let idList = getIdList(data, indexList);
            // let nameList = getNameList(data, indexList);
            // setIdList(idList);
            // setNameList(nameList);
            // setIndexList(indexList);
            setValue(targetValue);
        };

        //说明value存在
        useEffect(() => {
            changeValue(props.value);
        }, [props.value]);

        useEffect(
            () => {
                let {url, parse, params, extra = []} = props;
                async function loadData() {
                    if (url) {
                        let d = await request(url, params);
                        let data = d.data || [];
                        return parseRemoteData(data, parse);
                    } else {
                        return [];
                    }
                }

                loadData().then((rows = []) => {
                    let allData = [...extra, ...rows];
                    allData = parseFormData(allData);
                    setData(allData);
                });
            },
            [
                props.url,
                JSON.stringify(props.parse),
                JSON.stringify(props.params),
                JSON.stringify(props.extra)
            ]
        );

        return {
            data,
            value,
            changeValue
        };
    }

    function parseData(value, data) {
        function findIndexListWithValue(rows = [], currValue, fatherIndex = []) {
            for (let i = 0; i < rows.length; i++) {
                let item = rows[i];
                if (item.children && item.children.length > 0) {
                    let itemFatherIndex = [...fatherIndex, i];
                    let findResult = findIndexListWithValue(item.children, currValue, itemFatherIndex);
                    if (findResult.length > itemFatherIndex.length) {
                        return findResult;
                    }
                } else {
                    if (item[idKey] === currValue) {
                        return [...fatherIndex, i];
                    }
                }
            }
            return fatherIndex;
        }

        function getIdList(rows = [], indexList = []) {
            let currRows = rows;
            let list = [];
            for (let i = 0; i < indexList.length; i++) {
                let index = indexList[i];
                let item = currRows[index] || {};
                list.push(item[idKey]);
                currRows = item.children || [];
            }
            return list;
        }

        function getNameList(rows = [], indexList = []) {
            let currRows = rows;
            let list = [];
            for (let i = 0; i < indexList.length; i++) {
                let index = indexList[i];
                let item = currRows[index] || {};
                list.push(item[nameKey]);
                currRows = item.children || [];
            }
            return list;
        }

        let indexList = findIndexListWithValue(data, value);
        let idList = getIdList(data, indexList);
        let nameList = getNameList(data, indexList);
        return {
            indexList, idList, nameList
        }
    }

    return {
        getState, propsTypes,parseData
    }
}

