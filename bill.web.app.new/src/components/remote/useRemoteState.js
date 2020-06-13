import {useEffect, useState} from "react";
import {arrayToMap, deleteAllEmptyChildren} from "./remote.util";

function parseData(rows = [], parse = {}) {
    const {id = "id", name = "name"} = parse;
    return rows.map((item = {}) => {
        if (typeof parse === "function") {
            return {
                ...parse(item),
                children: parseData(item.children, parse)
            };
        } else {
            return {
                id: item[id],
                name: item[name],
                children: parseData(item.children, parse)
            };
        }
    });
}

export function useRemoteState(props) {
    const {loadData, parse, params = {}, extraOptions = [], ...restProps} = props;
    const [data, setData] = useState(extraOptions || []);
    const [dataMap, setDataMap] = useState({});
    useEffect(
        () => {
            loadData(params).then(d => {
                const data = d.data || [];
                const parsedData = parseData(data, parse);
                let allData = [...extraOptions, ...parsedData];
                deleteAllEmptyChildren(parsedData);
                setData(allData);
                setDataMap(arrayToMap(allData))
            });
        },
        [
            JSON.stringify(params),
            JSON.stringify(extraOptions)
        ]
    );

    return {
        data,
        dataMap
    };
}



