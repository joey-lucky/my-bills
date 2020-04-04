import {useEffect, useState} from "react";
import {Ajax} from "@utils/ajax";

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

function loadData(url, params, parse) {
    if (url) {
        return Ajax.apiPost(url, params).then(d=>{
            let data = d.data || [];
            return parseData(data, parse);
        });
    } else {
        return Promise.resolve([]);
    }
}

export function useRemoteFormState(props) {
    const {url, parse, params, extraOptions = [], value:propValue, defaultValue,...restProps} = props;

    const [data, setData] = useState(extraOptions || []);
    const [value, setValue] = useState(propValue || defaultValue);

    useEffect(() => {
        setValue(propValue);
    }, [propValue]);

    useEffect(
        () => {
            loadData(url, params, parse).then((rows = []) => {
                let allData = [...extraOptions, ...rows];
                setData(allData);
            });
        },
        [
            url,
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


