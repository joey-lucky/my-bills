import React from "react";
import * as PropTypes from "prop-types";
import {Transfer} from "antd";

/**
 * 和antd的form配合，会返回选中项目的ID数组
 */
class UsTransfer extends React.Component {
    static propTypes = {
        onChange: PropTypes.any,
        value: PropTypes.any,
        dataSource: PropTypes.any
    };

    constructor(props) {
        super(props);
        let {value} = this.props;
        let selectKeys = [];
        if (value && value instanceof Array) {
            for (let i = 0; i < value.length; i++) {
                selectKeys.push(value[i]);
            }
        }
        this.state = {
            dataSource: [],
            targetData: selectKeys
        };
    }

    /**
     * 当父组件改变Props的时候，触发此事件
     */
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            let {value} = nextProps;
            let selectKeys = [];
            for (let i = 0; i < value.length; i++) {
                selectKeys.push(value[i]);
            }
            this.setState({
                targetData: selectKeys
            });
        }
    }

    onChange(nextTargetKeys) {
        this.setState({targetData: nextTargetKeys});
        const onchange = this.props.onChange;

        if (onchange) {
            onchange(nextTargetKeys);
        }
    }

    /**
     * 过滤函数，简单做匹配
     */
    filterOption = (inputValue, option) => option.url.indexOf(inputValue) > -1

    render() {

        return (
            <Transfer
                dataSource={this.props.dataSource}
                targetKeys={this.state.targetData}
                showSearch
                filterOption={this.filterOption}
                onChange={nextTargetKeys => this.onChange(nextTargetKeys)}
                render={item => item.NAME}
            />
        );
    }
}

export default UsTransfer;
