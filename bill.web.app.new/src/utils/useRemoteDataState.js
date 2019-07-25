import {useEffect, useState} from "react";
import {request} from "@utils/request";



export default function useRemoteDataState(props,{idKey="id",nameKey="name"}) {
    const [data, setData] = useState([]);
    const [value, setValue] = useState(null);
    const [idList, setIdList] = useState([]);
    const [nameList, setNameList] = useState([]);
    const [indexList, setIndexList] = useState([]);

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

    const changeValue = (targetValue) => {
        let indexList = findIndexListWithValue(data, targetValue);
        let idList = getIdList(data, indexList);
        let nameList = getNameList(data, indexList);
        setIdList(idList);
        setNameList(nameList);
        setIndexList(indexList);
        setValue(targetValue);
    };

    useEffect(() => {
        let {value: propValue} = props;
        changeValue(propValue);
    }, [props.value]);

    useEffect(() => {
        let {url, parse, params, data: propData,extra=[]} = props;
        async function loadData() {
            if (propData) {
                return propData;
            }

            function parseData(rows, parse) {
                const {id = "id", name = "name"} = parse;
                return rows.map((item) => {
                    if (item) {
                        if (typeof parse === "function") {
                            item = parse(item);
                            if (item.children) {
                                item.children = parseData(item.children, parse);
                            }
                        } else {
                            item[idKey] = item[id];
                            item[nameKey] = item[name];
                            if (item.children) {
                                item.children = parseData(item.children, parse.children);
                            }
                        }
                    }
                    return item;
                });
            }

            let d = await request(url, params);
            let data = d.data || [];
            return parseData(data, parse);
        }

        loadData().then((rows=[]) => {
            rows.splice(0, 0, ...extra);
            let indexList = findIndexListWithValue(rows, value);
            let idList = getIdList(rows, indexList);
            let nameList = getNameList(rows, indexList);
            setIdList(idList);
            setNameList(nameList);
            setIndexList(indexList);
            setData(rows);
        });
    }, [props.url, props.parse, props.params, props.data,props.extra]);

    return {
        data,
        value,
        idList,
        nameList,
        indexList,
        changeValue
    };
}