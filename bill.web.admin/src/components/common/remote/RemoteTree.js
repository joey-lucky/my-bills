import * as React from "react";
import * as PropTypes from "prop-types";
import {Tree} from "antd";
import useRemoteFormState from "./useRemoteFormState";

function parseTreeData(data = []) {
    return data.map(item => {
        let result = {
            key: item.id,
            title: item.name,
        };
        if (item.children && item.children.length > 0) {
            result.children = parseTreeData(item.children);
        }
        return result;
    });
}

export default function RemoteTree(props) {
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
            checkedKeys: value,
        };
    }

    return (
        <Tree
            {...restProps}
            {...valueProps}
            onCheck={onChange}
            checkable={true}
            multiple={true}
            selectable={false}
            treeData={parseTreeData(data)}
        />
    );
}

RemoteTree.propTypes = {
    //表单必备
    value: PropTypes.arrayOf(PropTypes.string),
    defaultValue: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,

    //remote数据必备
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

    //其他
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    focusable: PropTypes.bool,
    tabIndex: PropTypes.number,
    children: React.ReactNode,
    treeData: PropTypes.array,
    showLine: PropTypes.bool,
    showIcon: PropTypes.bool,
    icon: PropTypes.node,
    selectable: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    checkable: PropTypes.bool | React.ReactNode,
    checkStrictly: PropTypes.bool,
    draggable: PropTypes.bool,
    defaultExpandParent: PropTypes.bool,
    autoExpandParent: PropTypes.bool,
    defaultExpandAll: PropTypes.bool,
    defaultExpandedKeys: PropTypes.array,
    expandedKeys: PropTypes.array,
    defaultCheckedKeys: PropTypes.array,
    checkedKeys: PropTypes.array,
    defaultSelectedKeys: PropTypes.array,
    selectedKeys: PropTypes.array,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onExpand: PropTypes.func,
    onCheck: PropTypes.func,
    onSelect: PropTypes.func,
    onLoad: PropTypes.func,
    loadData: PropTypes.func,
    loadedKeys: PropTypes.array,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onRightClick: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnter: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDrop: PropTypes.func,
    filterTreeNode: PropTypes.func,
    motion: PropTypes.any,
    switcherIcon: PropTypes.node,
    height: PropTypes.number,
    itemHeight: PropTypes.number,
};
