import {useEffect, useState} from "react";
import Assert from "@utils/Assert";

function mergeParams(params = {}, current, pageSize) {
    let mergeParams = {...params};
    mergeParams.pageSize = pageSize;
    mergeParams.pageIndex = current;
    return mergeParams;
}

export function useRemotePageDataState(props) {
    const {loadData:propLoadData, parse, params = {}, lastModifyDate = 0, pagination = {}} = props;
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(pagination.current || 1);

    const pageSize = pagination.pageSize || pagination.defaultPageSize || 15;
    const loadData = async (current) => {
        setLoading(true);
        try {
            Assert.notNull(propLoadData, "prop loadData is null");
            setLoading(true);
            let requestParams = mergeParams(params, current, pageSize);
            let d = await propLoadData(requestParams);
            let data = d.data || [];
            let pageInfo = d.pageInfo || {};
            if (parse) {
                data = data.map((item, index, data) => parse(item, index, data))
            }
            setTotal(pageInfo && pageInfo.count || 0);
            setLoading(false);
            setData(data);
        } catch (err) {
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(
        () => {
            setCurrent(1);
            loadData(1).then();
        },
        [
            JSON.stringify(params),
            pageSize,
        ]
    );

    useEffect(
         () => {
            loadData(current).then();
         },
        [
            lastModifyDate,
        ]
    );

    const changeCurrent = (current) => {
        setCurrent(current);
        loadData(current).then();
    };

    return {
        data, changeCurrent, pageSize, current, loading, total,
    };
}

export default useRemotePageDataState;
