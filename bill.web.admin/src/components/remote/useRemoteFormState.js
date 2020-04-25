import {useEffect, useState} from "react";
import {deleteAllEmptyChildren} from "@utils/treeDataUtils";

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

export function useRemoteFormState(props) {
    const {loadData, parse, params = {}, extraOptions = [], value: propValue, defaultValue, ...restProps} = props;

    const [data, setData] = useState(extraOptions || []);
    const [value, setValue] = useState(propValue || defaultValue);

    useEffect(() => {
        setValue(propValue);
    }, [propValue]);

    useEffect(
        () => {
            loadData(params).then(d => {
                const data = d.data || [];
                const parsedData = parseData(data, parse);
                deleteAllEmptyChildren(parsedData);
                setData([...extraOptions, ...parsedData]);
            });
        },
        [
            JSON.stringify(params),
            JSON.stringify(extraOptions)
        ]
    );

    return {
        data,
        value,
        setValue,
        restProps: restProps
    };
}

export default useRemoteFormState;


