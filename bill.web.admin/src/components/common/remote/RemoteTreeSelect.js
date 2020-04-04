import * as React from "react";
import * as PropTypes from "prop-types";
import {TreeSelect} from "antd";
import useRemoteFormState from "./useRemoteFormState";

function parseTreeData(data = []) {
    return data.map(item => {
        let result = {
            value: item.id,
            title: item.name,
        };
        if (item.children && item.children.length > 0) {
            result.children = parseTreeData(item.children);
        }
        return result;
    });
}

export default function RemoteTreeSelect(props) {
    const {data, value, setValue, restProps} = useRemoteFormState(props);
    const onChange = (targetValue) => {
        if (targetValue !== value) {
            if (!("value" in props)) {
                setValue(targetValue);
            }
            props.onChange && props.onChange(targetValue);
        }
    };

    //tree select 有bug,需要在有数据的时候设置value
    let valueProps = {};
    if (data.length > 0) {
        valueProps = {
            value: value,
        };
    }

    return (
        <TreeSelect
            {...restProps}
            {...valueProps}
            treeNodeFilterProp={"title"}
            showSearch={true}
            treeData={parseTreeData(data)}
            onChange={onChange}
        />
    );
}

RemoteTreeSelect.propTypes = {
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
    multiple: PropTypes.bool,
    showArrow: PropTypes.bool,
    showSearch: PropTypes.bool,
    open: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: React.ReactNode,
    searchValue: PropTypes.string,
    autoClearSearchValue: PropTypes.bool,
    maxTagTextLength: PropTypes.number,
    maxTagCount: PropTypes.number,
    maxTagPlaceholder:PropTypes.func,
    loadData:PropTypes.func,
    treeNodeFilterProp: PropTypes.string,
    treeNodeLabelProp: PropTypes.string,
    treeDataSimpleMode: PropTypes.bool ,
    treeExpandedKeys: PropTypes.array,
    treeDefaultExpandedKeys: PropTypes.array,
    treeLoadedKeys: PropTypes.array,
    treeCheckable: PropTypes.bool | React.ReactNode,
    treeCheckStrictly: PropTypes.bool,
    showCheckedStrategy: PropTypes.string,
    treeDefaultExpandAll: PropTypes.bool,
    treeData: PropTypes.array,
    treeLine: PropTypes.bool,
    treeIcon: PropTypes.node,
    showTreeIcon: PropTypes.bool,
    switcherIcon: PropTypes.node,
    treeMotion: PropTypes.any,
    children: React.ReactNode,
    filterTreeNode: PropTypes.bool ,
    dropdownPopupAlign: PropTypes.any,
    onSearch: PropTypes.func,
    onTreeExpand:  PropTypes.func,
    onTreeLoad:  PropTypes.func,
};
