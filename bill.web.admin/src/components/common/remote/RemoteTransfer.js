import * as React from "react";
import * as PropTypes from "prop-types";
import {Transfer} from "antd";
import useRemoteFormState from "./useRemoteFormState";

function parseTransferData(data = []) {
    data.forEach(item => {
        item.key = item.id;
        item.title = item.name;
        if (item.children && item.children.length > 0) {
            item.children = parseTransferData(item.children);
        }
    });
    return data;
}

export default function RemoteTransfer(props) {
    const {data, value, setValue} = useRemoteFormState(props);
    const {
        titles = ["所有", "已选"],
        operations = ["添加", "移除"],
        locale = {searchPlaceholder: "关键字"},
        ...rest
    } = props;
    const filterOption = (inputValue = "", option) => option.props.children.indexOf(inputValue) > -1;

    const onChange = (targetValue) => {
        if (targetValue !== value) {
            if (!("value" in props)) {
                setValue(targetValue);
            }
            props.onChange && props.onChange(targetValue);
        }
    };
    return (
        <Transfer
            {...rest}
            titles={titles}
            operations={operations}
            locale={locale}
            dataSource={parseTransferData(data)}
            targetKeys={value}
            showSearch={true}
            filterOption={filterOption}
            onChange={onChange}
            render={item => item.name}
        />
    );
}

RemoteTransfer.propTypes = {
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
    extraOptions: PropTypes.array,
    onChange: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    titles:PropTypes.arrayOf(PropTypes.string),
    operations:PropTypes.func,
    locale:PropTypes.object,
};
