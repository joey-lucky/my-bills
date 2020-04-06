import {useEffect, useState} from "react";

function parseData(rows = [], parse = {}) {
    const {id = "id", name = "name"} = parse;
    return rows.map((item) => {
        if (item) {
            if (typeof parse === "function") {
                item = parse(item);
                if (item.children) {
                    item.children = parseData(item.children, parse);
                }
            } else {
                item.id = item[id];
                item.name = item[name];
                if (item.children) {
                    item.children = parseData(item.children, parse);
                }
            }
        }
        return item;
    });
}

export function useRemoteFormState(props) {
    const {loadData, parse, params={}, extraOptions = [], value:propValue, defaultValue,...restProps} = props;

    const [data, setData] = useState(extraOptions || []);
    const [value, setValue] = useState(propValue || defaultValue);

    useEffect(() => {
        setValue(propValue);
    }, [propValue]);

    useEffect(
         () => {
            loadData(params).then(d=>{
                const data = d.data || [];
                const parsedData = parseData(data,parse);
                setData([...extraOptions,...parsedData]);
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
        restProps:restProps
    };
}

export default useRemoteFormState;


