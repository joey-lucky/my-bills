import {useEffect, useState} from "react";
import {Ajax} from "@utils/ajax";

export function useRemotePageDataState(props) {
    const {url, parse, params = {}, lastModifyDate = 0, pagination = {}} = props;
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(pagination.current || 1);


    const pageSize = pagination.pageSize || pagination.defaultPageSize || 15;

    const asyncLoadData =  (current) => {
        if (!!url) {
            setLoading(true);
            let requestParams = {...params};
            requestParams.pageSize = pageSize;
            requestParams.pageIndex = current;
            Ajax.apiPost(url, requestParams)
                .then((d)=>{
                    let data = d.data || [];
                    if (parse) {
                        data = data.map((item, index, data) => parse(item, index, data))
                    }
                    setTotal(d["page_info"] && d["page_info"].recordCount || 0);
                    setData(data);
                    setLoading(false);
                })
                .catch((err)=>{
                    setLoading(false);
                    console.error(err);
                });
        }
    };

    useEffect(
        () => {
            asyncLoadData(1);
        },
        [
            url,
            JSON.stringify(params),
            pageSize,
        ]
    );

    useEffect(
        ()=>{
            asyncLoadData(current);
        },
        [
            lastModifyDate,
        ]
    );

    const changeCurrent = (current) => {
        setCurrent(current);
        asyncLoadData(current);
    };

    return {
        data, changeCurrent, pageSize, current, loading, total,
    };
}

export default useRemotePageDataState;
