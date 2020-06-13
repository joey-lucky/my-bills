import {useEffect, useState} from "react";
import {arrayToMap, deleteAllEmptyChildren, parseData} from "./remote.util";

export function useRemoteFormState(props) {
    const {
        loadData = ()=>Promise.resolve([]),
        parse = {
            id: "id",
            name: "name"
        },
        params = {},
        extra = [],
        value: propValue, defaultValue, ...restProps
    } = props;
    const [data, setData] = useState(extra || []);
    const [value, setValue] = useState(propValue || defaultValue);
    const [dataMap, setDataMap] = useState({});
    useEffect(() => {
        setValue(propValue);
    }, [propValue]);

    useEffect(
        () => {
            loadData(params).then(d => {
                const data = d.data || [];
                const parsedData = parseData(data, parse);
                deleteAllEmptyChildren(parsedData);
                let allData = [...extra, ...parsedData];
                setData(allData);
                setDataMap(arrayToMap(allData))
            });
        },
        [
            JSON.stringify(params),
            JSON.stringify(extra)
        ]
    );

    return {
        data,
        value,
        setValue,
        restProps,
        dataMap
    };
}

export default useRemoteFormState;


