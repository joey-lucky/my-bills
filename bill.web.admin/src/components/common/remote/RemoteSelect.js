import * as React from "react";
import * as PropTypes from "prop-types";
import {Select} from "antd";
import useRemoteFormState from "./useRemoteFormState"

export default function RemoteSelect(props) {
    const {data, value, setValue} = useRemoteFormState(props);

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
        <Select
            {...props}
            optionFilterProp={"children"}
            value={value}
            onChange={onChange}
            showSearch={true}
        >
            {
                data.map((item, index) => <Select.Option key={"data_" + item.id} value={item.id}>{item.name}</Select.Option>)
            }
        </Select>
    );
}

RemoteSelect.propTypes = {
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    loadData:PropTypes.func,
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
    size: PropTypes.oneOf(["default", "large", "small"]),
    notFoundContent: PropTypes.any,
    showSearch: PropTypes.bool,
    optionLabelProp: PropTypes.string,
    transitionName: PropTypes.string,
    choiceTransitionName: PropTypes.string,
    id: PropTypes.string,
    disabled: PropTypes.bool,
};
