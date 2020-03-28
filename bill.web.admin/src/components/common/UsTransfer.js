import React from "react";
import {Transfer} from "antd";
import {toJS} from "mobx";
import * as PropTypes from "prop-types";

/**
 * 和antd的form配合，会返回选中项目的ID数组
 */
export default class UsTransfer extends React.Component {
    static propTypes = {
        dataSource: PropTypes.any,
        value: PropTypes.any,
        onChange: PropTypes.any,
        label: PropTypes.any
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (!this.isEqual(this.props.dataSource, nextProps.dataSource)) {
            const {dataSource = [], value = []} = nextProps;
            const allKeys = new Set();
            dataSource.forEach((item) => {
                allKeys.add(item.key);
            });
            // 数据变化后，选中项只保留依然存在的选项。
            let unContainValue = value.filter(item => !allKeys.has(item));
            if (unContainValue.length > 0) {
                let targetKeys = value.filter(item => allKeys.has(item));
                this.onChange(targetKeys);
            }
        }
    }

    onChange = (targetKeys, direction, moveKeys) => {
        const {onChange} = this.props;
        onChange && onChange(targetKeys, direction, moveKeys);
    };

    isEqual(data1 = [], data2 = []) {
        if (data1 === data2) {
            return true;
        } else if (data1.length !== data2.length) {
            return false;
        } else {
            return JSON.stringify(data1) === JSON.stringify(data2);
        }
    }

    /**
     * 过滤函数，简单做匹配
     */
    filterOption = (inputValue, option) => {
		if(option.NAME){
			if(option.NAME.indexOf(inputValue) > -1){
				return option;
			}
		}
	}

    render() {
        // dataSource格式为{key,NAME}
        const {
            dataSource = [],
            value = [],
            label = "",
            ...props
        } = this.props;
        let targetKeys = Array.from(value);// 修复form表单默认value为空字符串的问题。
        return (
            <Transfer
                {...props}
                dataSource={toJS(dataSource)}
                targetKeys={targetKeys}
                showSearch
                titles={["所有" + label, "已选" + label]}
                operations={["添加", "移除"]}
                locale={{searchPlaceholder: "关键字"}}
                filterOption={this.filterOption}
                onChange={this.onChange}
                render={item => item.NAME}
            />
        );
    }
}
